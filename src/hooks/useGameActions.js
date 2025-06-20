import { toast } from "react-toastify";
import {
  fpChallengeFriendAction,
  fPDeleteMatchAction,
  freeAvailableMatchJoinAction,
  freePlayMatchResultAction,
  freePlaySubmitScoreAction,
  freePlayUpdateMatchAction,
  freePlayUpdateReadyStatusAction,
  getCurrentMatchesAction,
  getEntryAmountAction,
  getFreePlayMatchReqCreateAction,
  getFreePlayMatchReqUpdateAction,
  getGameModeCurrentMatchAction,
  getMatchRuleAction,
  getSearchUserAction,
} from "@/redux/dashboard/action";
import { setLoading } from "@/redux/dashboard/slice";
import {
  TOAST_ALERTS,
  TOAST_TYPES,
  CommonConstant,
} from "@/constants/keywords";
import {
  getConsoleData,
  getData,
} from "@/utils/storage";
import { format } from "date-fns";

const getCurrentTime = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");

const useGameActions = (dispatch, setUiState, setMatchState, toaster) => {
  const user = getData("user");

  const getCurrentMatches = async () => {
    setUiState((s) => ({ ...s, isLoader: true }));
    try {
      const res = await dispatch(getCurrentMatchesAction());
      if (res.payload.statusCode === 200) {
        setMatchState((s) => ({ ...s, currentMatchList: res.payload.data }));
      } else {
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    } finally {
      setUiState((s) => ({ ...s, isLoader: false }));
    }
  };

  const getAmountData = async () => {
    setUiState((s) => ({ ...s, isLoader: true }));
    try {
      const res = await dispatch(getEntryAmountAction());
      if (res.payload.statusCode === 200) {
        setMatchState((s) => ({
          ...s,
          amountData: res.payload.data,
          isWageringStop: res.payload.isWageringStop,
          isSubscription: res.payload.isSubscription,
        }));
      }
    } finally {
      setUiState((s) => ({ ...s, isLoader: false }));
    }
  };

  const getRuleApi = async (gameId) => {
    setUiState((s) => ({ ...s, isLoader: true }));
    try {
      const res = await dispatch(getMatchRuleAction(gameId));
      setMatchState((s) => ({
        ...s,
        ruleData: res.payload.data?.data || [],
      }));
    } finally {
      setUiState((s) => ({ ...s, isLoader: false }));
    }
  };

  const getGameModeCurrentMatch = async (amountData, gameMode) => {
    setUiState((s) => ({ ...s, isLoader: true }));
    try {
      const res = await dispatch(getGameModeCurrentMatchAction());
      if (res.payload.statusCode === 200) {
        if (CommonConstant.challengeData) {
          await challengeFreePlayMatch(amountData, gameMode);
        } else {
          await createFreePlayMatch(amountData, gameMode);
        }
      }
    } finally {
      setUiState((s) => ({ ...s, isLoader: false }));
    }
  };

  const createFreePlayMatch = async (amountData, gameMode) => {
    const consoleData = getConsoleData("consoleData");
    const form = new FormData();
    form.append("host", user.data.id);
    form.append("consoles", consoleData.id);
    form.append("game", gameMode.game);
    form.append("gamemodes", gameMode.id);
    form.append("timezone_name", Intl.DateTimeFormat().resolvedOptions().timeZone);
    form.append("startTime", getCurrentTime());
    form.append("endTime", getCurrentTime());

    const res = await dispatch(getFreePlayMatchReqCreateAction(form));
    const { data, status } = res.payload;
    if (status) {
      getCurrentMatches();
      setUiState((s) => ({ ...s, selectedModelIndex: 3 }));
      toaster(data.message, TOAST_TYPES.SUCCESS);
    } else {
      setUiState((s) => ({ ...s, selectedModelIndex: 2 }));
      toaster(data.message, TOAST_TYPES.ERROR);
    }
  };

  const challengeFreePlayMatch = async (amountData, gameMode) => {
    const consoleData = getConsoleData("consoleData");
    const form = new FormData();
    form.append("host", user.data.id);
    form.append("consoles", consoleData.id);
    form.append("game", gameMode.game);
    form.append("gamemodes", gameMode.id);
    form.append("game_type", 0);
    form.append("opponent", CommonConstant.challengeData.id);
    form.append("timezone_name", Intl.DateTimeFormat().resolvedOptions().timeZone);
    form.append("startTime", getCurrentTime());

    const res = await dispatch(fpChallengeFriendAction(form));
    const { data, status } = res.payload;
    if (status) {
      getCurrentMatches();
      setUiState((s) => ({ ...s, isModelShow: false }));
      toaster(data.message, TOAST_TYPES.SUCCESS);
    } else {
      setUiState((s) => ({ ...s, selectedModelIndex: 2 }));
      toaster(data.message, TOAST_TYPES.ERROR);
    }
  };

  const updateFreePlayMatchStatus = async () => {
    const form = new FormData();
    form.append("game_type", CommonConstant.SelectedMatchData.ismultipleuser);
    form.append("match_request_id", CommonConstant.SelectedMatchData.match_request_id);
    form.append("endTime", getCurrentTime());

    const res = await dispatch(freePlayUpdateMatchAction(form));
    const { data, status } = res.payload;
    if (status) {
      CommonConstant.SelectedMatchData = { ...CommonConstant.SelectedMatchData, ...data.data };
      setUiState((s) => ({ ...s, selectedModelIndex: 6 }));
    } else {
      setUiState((s) => ({ ...s, selectedModelIndex: 5 }));
    }
  };

  const updateFreePlayReadyStatus = async () => {
    const form = new FormData();
    form.append("id", CommonConstant.SelectedMatchData.match_request_id);
    form.append("user_id", user.data.id);
    form.append("ready_status", 1);

    const res = await dispatch(freePlayUpdateReadyStatusAction(form));
    const { status } = res.payload;
    if (status) {
      setMatchState((s) => ({ ...s, readyClick: true, readyTimes: "" }));
    } else {
      toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
    }
  };

  const submitFreePlayScore = async (score) => {
    const form = new FormData();
    form.append("score_by_user", user.data.id);
    form.append("match_request_id", CommonConstant.SelectedMatchData.match_request_id);
    form.append("score", score);
    form.append("endTime", getCurrentTime());

    const res = await dispatch(freePlaySubmitScoreAction(form));
    const { status } = res.payload;
    setUiState((s) => ({ ...s, isSubmitScoreBtn: status }));
    if (!status) toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
  };

  const resultFreePlayMatch = async (result) => {
    const form = new FormData();
    form.append("id", CommonConstant.SelectedMatchData.match_request_id);
    form.append("user_id", user.data.id);
    form.append("result", result);

    const res = await dispatch(freePlayMatchResultAction(form));
    const { status } = res.payload;
    setUiState((s) => ({ ...s, selectedModelIndex: status ? 8 : 7 }));
    if (!status) toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
  };

  const updateFreePlayRequest = async (statusParam) => {
    const form = new FormData();
    form.append("id", CommonConstant.SelectedMatchData.match_request_id);
    form.append("status", statusParam);
    form.append("endTime", getCurrentTime());
    form.append("user_id", user.data.id);

    const res = await dispatch(getFreePlayMatchReqUpdateAction(form));
    if (statusParam === "1") {
      setUiState((s) => ({ ...s, selectedModelIndex: 5 }));
    } else {
      setUiState((s) => ({ ...s, selectedModelIndex: 2, isModelShow: false }));
      getCurrentMatches();
    }
  };

  const deleteFreePlayMatch = async (item) => {
    const form = new FormData();
    form.append("game_type", item.ismultipleuser);
    form.append("matchCommonId", item.matchCommonId);

    const res = await dispatch(fPDeleteMatchAction(form));
    const { status, message } = res.payload;
    getCurrentMatches();
    toast[status ? "success" : "error"](message);
  };

  const searchUsers = async (term) => {
    const form = new FormData();
    form.append("name", term);
    try {
      const res = await dispatch(getSearchUserAction(form));
      setUiState((s) => ({ ...s, userSearchData: res.payload?.data?.data || [] }));
    } catch (e) {
      setUiState((s) => ({ ...s, userSearchData: [] }));
    }
  };

  return {
    getCurrentMatches,
    getAmountData,
    getRuleApi,
    getGameModeCurrentMatch,
    // joinAvailableMatch,
    createFreePlayMatch,
    challengeFreePlayMatch,
    updateFreePlayMatchStatus,
    updateFreePlayReadyStatus,
    submitFreePlayScore,
    resultFreePlayMatch,
    updateFreePlayRequest,
    deleteFreePlayMatch,
    searchUsers,
  };
};

export default useGameActions;
