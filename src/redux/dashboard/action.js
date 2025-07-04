import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  AddDeviceToken,
  AddSubscriptionData,
  AvailableMatchJoin,
  CreateDisputes,
  DeleteMatch,
  DisputesList,
  FPDeleteMatch,
  FreeAvailableMatchJoin,
  FreePlayChallenge,
  FreePlayMatchReqUpdate,
  FreePlayMatchResult,
  FreePlaySubmitScore,
  FreePlayUpdateMatchStatus,
  FreePlayUpdateReadyStatus,
  GetAvailableMatches,
  GetBadge,
  GetBadges,
  GetBadgesData,
  GetBadgesList,
  GetBadgeUserList,
  GetCardPurchase,
  GetChallengeFriend,
  GetChatList,
  GetConsole,
  GetCurrentMatches,
  getCurrentTournamentMatch,
  GetDisputeChat,
  GetEntryAmount,
  GetFpChallengeFriend,
  GetFreePlayMatchReqCreate,
  GetGameByConsole,
  GetGameHistory,
  GetGameList,
  GetGameMode,
  GetGameModeCurrentMatch,
  GetGameRemain,
  GetGameWinLoss,
  GetMatchReqCreate,
  GetMatchRule,
  GetMyTournament,
  GetNews,
  GetNotificationList,
  GetPaypalPlanList,
  GetPlanDetail,
  GetProfileCard,
  GetProfileData,
  GetRecentEarner,
  getRegisterUserList,
  GetRoomChatThread,
  GetSearchBadges,
  GetSearchUser,
  GetSeasonList,
  GetSubscriptionDetail,
  GetTop5Users,
  GetTournamentChatList,
  GetTournamentList,
  GetTournamentRules,
  GetUserPoints,
  LeaveRoom,
  MatchHistoryList,
  TrackerList,
  MatchReqUpdate,
  MatchReqUpdateMultiPlayer,
  MatchResult,
  RoomChat,
  SelectRoom,
  SendChat,
  SendDisputeChat,
  SendGroupChat,
  SendRoomChat,
  SendTourPersonalChatApi,
  SubmitScore,
  TestNotification,
  TournamentMatchResult,
  TournamentRegister,
  TournamentSubmitScore,
  TourPersonalChat,
  UpdateMatchStatus,
  UpdateProfile,
  UpdateReadyStatus,
  UpdateReadyTournamentStatus,
  UpdateStartMatch,
  UserChatList,
  WithdrawAmount,
} from "./services";

export const getRoomList = createAsyncThunk(
  "dashboardSlice/getRoomList",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameList(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const selectRoomAction = createAsyncThunk(
  "dashboardSlice/selectRoomAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SelectRoom(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const leaveRoomAction = createAsyncThunk(
  "dashboardSlice/leaveRoomAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await LeaveRoom(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getAvailableMatchesAction = createAsyncThunk(
  "dashboardSlice/getAvailableMatchesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetAvailableMatches(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getCurrentMatchesAction = createAsyncThunk(
  "dashboardSlice/getCurrentMatchesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetCurrentMatches(payload);
      console.log("🚀 ~ data:---------))", data)
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const deleteMatchAction = createAsyncThunk(
  "dashboardSlice/deleteMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await DeleteMatch(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const fPDeleteMatchAction = createAsyncThunk(
  "dashboardSlice/fPDeleteMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FPDeleteMatch(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMyTournamentAction = createAsyncThunk(
  "dashboardSlice/getMyTournamentAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMyTournament(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTournamentListAction = createAsyncThunk(
  "dashboardSlice/getTournamentListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetTournamentList(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getNewsAction = createAsyncThunk(
  "dashboardSlice/getNewsAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetNews(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgeAction = createAsyncThunk(
  "dashboardSlice/getBadgeAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadge(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getConsoleAction = createAsyncThunk(
  "dashboardSlice/getConsoleAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetConsole(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getRecentEarnerAction = createAsyncThunk(
  "dashboardSlice/getRecentEarnerAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetRecentEarner(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getEntryAmountAction = createAsyncThunk(
  "dashboardSlice/getEntryAmountAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetEntryAmount(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameModeAction = createAsyncThunk(
  "dashboardSlice/getGameModeAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameMode(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameModeCurrentMatchAction = createAsyncThunk(
  "dashboardSlice/getGameModeCurrentMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameModeCurrentMatch(payload);
      return data;
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqCreateAction = createAsyncThunk(
  "dashboardSlice/getMatchReqCreateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMatchReqCreate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqUpdateAction = createAsyncThunk(
  "dashboardSlice/getMatchReqUpdateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchReqUpdate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchReqUpdateMultiPlayerAction = createAsyncThunk(
  "dashboardSlice/getMatchReqUpdateMultiPlayerAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchReqUpdateMultiPlayer(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getMatchRuleAction = createAsyncThunk(
  "dashboardSlice/getMatchRuleAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetMatchRule(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const tournamentRegisterAction = createAsyncThunk(
  "dashboardSlice/tournamentRegisterAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await TournamentRegister(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getRegisterUserListAction = createAsyncThunk(
  "dashboardSlice/getRegisterUserListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await getRegisterUserList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getUpdateStartMatchAction = createAsyncThunk(
  "dashboardSlice/getUpdateStartMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateStartMatch(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getCurrentTournamentMatchAction = createAsyncThunk(
  "dashboardSlice/getCurrentTournamentMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await getCurrentTournamentMatch(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateMatchAction = createAsyncThunk(
  "dashboardSlice/updateMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateMatchStatus(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateReadyStatusAction = createAsyncThunk(
  "dashboardSlice/updateReadyStatusAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateReadyStatus(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateReadyTournamentStatusAction = createAsyncThunk(
  "dashboardSlice/updateReadyTournamentStatusAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateReadyTournamentStatus(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const tournamentSubmitScoreAction = createAsyncThunk(
  "dashboardSlice/tournamentSubmitScoreAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await TournamentSubmitScore(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const tournamentMatchResultAction = createAsyncThunk(
  "dashboardSlice/tournamentMatchResultAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await TournamentMatchResult(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const matchResultAction = createAsyncThunk(
  "dashboardSlice/matchResultAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchResult(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const submitScoreAction = createAsyncThunk(
  "dashboardSlice/submitScoreAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SubmitScore(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

/// Free Play
export const getFreePlayMatchReqCreateAction = createAsyncThunk(
  "dashboardSlice/getFreePlayMatchReqCreateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetFreePlayMatchReqCreate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const getFreePlayMatchReqUpdateAction = createAsyncThunk(
  "dashboardSlice/getFreePlayMatchReqUpdateAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayMatchReqUpdate(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const freePlayUpdateMatchAction = createAsyncThunk(
  "dashboardSlice/freePlayUpdateMatchAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayUpdateMatchStatus(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlayUpdateReadyStatusAction = createAsyncThunk(
  "dashboardSlice/freePlayUpdateReadyStatusAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayUpdateReadyStatus(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlayMatchResultAction = createAsyncThunk(
  "dashboardSlice/freePlayMatchResultAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayMatchResult(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlaySubmitScoreAction = createAsyncThunk(
  "dashboardSlice/freePlaySubmitScoreAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlaySubmitScore(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const challengeFriendAction = createAsyncThunk(
  "dashboardSlice/challengeFriendAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetChallengeFriend(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const fpChallengeFriendAction = createAsyncThunk(
  "dashboardSlice/fpChallengeFriendAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetFpChallengeFriend(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const availableMatchJoinAction = createAsyncThunk(
  "dashboardSlice/availableMatchJoinAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await AvailableMatchJoin(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freeAvailableMatchJoinAction = createAsyncThunk(
  "dashboardSlice/freeAvailableMatchJoinAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreeAvailableMatchJoin(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const roomChatAction = createAsyncThunk(
  "dashboardSlice/roomChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await RoomChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendChatAction = createAsyncThunk(
  "dashboardSlice/sendChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendChat(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendGroupChatAction = createAsyncThunk(
  "dashboardSlice/sendGroupChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendGroupChat(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendDisputeChatAction = createAsyncThunk(
  "dashboardSlice/sendDisputeChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendDisputeChat(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const createDisputesAction = createAsyncThunk(
  "dashboardSlice/createDisputesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await CreateDisputes(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameRemainAction = createAsyncThunk(
  "dashboardSlice/getGameRemainAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameRemain(payload);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const sendRoomChatAction = createAsyncThunk(
  "dashboardSlice/sendRoomChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendRoomChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const disputesListAction = createAsyncThunk(
  "dashboardSlice/disputesListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await DisputesList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const matchHistoryListAction = createAsyncThunk(
  "dashboardSlice/matchHistoryListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await MatchHistoryList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const trackerListAction = createAsyncThunk(
  "dashboardSlice/trackerListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await TrackerList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const getProfileCardAction = createAsyncThunk(
  "dashboardSlice/getProfileCardAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetProfileCard(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSeasonListAction = createAsyncThunk(
  "dashboardSlice/getSeasonListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSeasonList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameWinLossAction = createAsyncThunk(
  "dashboardSlice/getGameWinLossAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameWinLoss(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameByConsoleAction = createAsyncThunk(
  "dashboardSlice/getGameByConsoleAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameByConsole(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesAction = createAsyncThunk(
  "dashboardSlice/getBadgesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadges(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTop5UsersAction = createAsyncThunk(
  "dashboardSlice/getTop5UsersAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetTop5Users(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const addDeviceTokenAction = createAsyncThunk(
  "dashboardSlice/addDeviceTokenAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await AddDeviceToken(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getNotificationListAction = createAsyncThunk(
  "dashboardSlice/getNotificationListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetNotificationList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getWithdrawAmountAction = createAsyncThunk(
  "dashboardSlice/getWithdrawAmountAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await WithdrawAmount(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getPlanDetailAction = createAsyncThunk(
  "dashboardSlice/getPlanDetailAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetPlanDetail(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTournamentRulesAction = createAsyncThunk(
  "dashboardSlice/getTournamentRulesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetTournamentRules(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const addSubscriptionDataAction = createAsyncThunk(
  "dashboardSlice/addSubscriptionDataAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await AddSubscriptionData(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSubscriptionDetailAction = createAsyncThunk(
  "dashboardSlice/getSubscriptionDetailAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSubscriptionDetail(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const updateProfileAction = createAsyncThunk(
  "dashboardSlice/updateProfileAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UpdateProfile(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const paypalPlanListAction = createAsyncThunk(
  "dashboardSlice/paypalPlanListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetPaypalPlanList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const cardPurchaseAction = createAsyncThunk(
  "dashboardSlice/cardPurchaseAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetCardPurchase(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getProfileDataAction = createAsyncThunk(
  "dashboardSlice/getProfileDataAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetProfileData(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesDataAction = createAsyncThunk(
  "dashboardSlice/getBadgesDataAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadgesData(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getUserPointsAction = createAsyncThunk(
  "dashboardSlice/getUserPointsAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetUserPoints(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const freePlayChallengeAction = createAsyncThunk(
  "dashboardSlice/freePlayChallengeAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await FreePlayChallenge(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgeUserListAction = createAsyncThunk(
  "dashboardSlice/getUserPointsAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadgeUserList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSearchBadgesAction = createAsyncThunk(
  "dashboardSlice/getSearchBadgesAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSearchBadges(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getGameHistoryAction = createAsyncThunk(
  "dashboardSlice/getGameHistoryAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetGameHistory(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getBadgesListAction = createAsyncThunk(
  "dashboardSlice/getBadgesListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetBadgesList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getRoomChatThreadAction = createAsyncThunk(
  "dashboardSlice/getRoomChatThreadAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetRoomChatThread(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const userChatListAction = createAsyncThunk(
  "dashboardSlice/userChatListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await UserChatList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getChatListAction = createAsyncThunk(
  "dashboardSlice/getChatListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetChatList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTournamentChatListAction = createAsyncThunk(
  "dashboardSlice/getTournamentChatListAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetTournamentChatList(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getTourPersonalChatAction = createAsyncThunk(
  "dashboardSlice/getTourPersonalChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await TourPersonalChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getSendTourPersonalChatApiAction = createAsyncThunk(
  "dashboardSlice/getSendTourPersonalChatApiAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await SendTourPersonalChatApi(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
export const getDisputeChatAction = createAsyncThunk(
  "dashboardSlice/getDisputeChatAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetDisputeChat(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const getSearchUserAction = createAsyncThunk(
  "dashboardSlice/getSearchUserAction",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, status } = await GetSearchUser(payload);
      // console.log("status", status);
      return { data, status };
    } catch (err) {
      console.log("🚀 ~ err:", err);
      toast.error(err?.response?.data?.message || err.message);
      if (err instanceof AxiosError) {
        return rejectWithValue(err?.response?.data?.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
