import { useEffect } from "react";
import { getData, getCreate } from "@/utils/storage";
import { CommonConstant } from "@/constants/keywords";

const useInitGameState = (state, setState, setMatchData, getRuleApi, getCurrentMatches) => {
  useEffect(() => {
    if (CommonConstant.challengeData) {
      setState((s) => ({
        ...s,
        isChallenge: true,
        isModelShow: true,
      }));
      setMatchData((s) => ({
        ...s,
        challengeUserDetail: CommonConstant.challengeData,
      }));
    }
    getCurrentMatches();
  }, []);

  useEffect(() => {
    return () => {
      CommonConstant.isModelShow = false;
      CommonConstant.challengeData = null;
    };
  }, []);

  useEffect(() => {
    if (CommonConstant.SelectedMatchData) {
      const data = CommonConstant.SelectedMatchData;
      const user = getData("user");

      setState((s) => ({ ...s, isModelShow: true }));
      setMatchData((m) => ({ ...m, current: data }));
      CommonConstant.CurrentGameDetails = data;
      CommonConstant.FreePlayData = data;

      getRuleApi(data.game);

      const isHost = data.host === user.data.id;
      const isOpponentReady = data.opponent_ready_status === "1";
      const isHostReady = data.host_ready_status === "1";
      const isScoreAdded = isHost ? data.isScoreAddedHost : data.isScoreAddedOpponent;
      const isResultAdded = isHost ? data.isResultAddedHost === "1" : data.isResultAddedOpponent === "1";
      const matchStarted = isHost ? data.start_match : data.start_match1;
      const matchStatus = isHost ? data.status : data.status1;

      let newIndex = 2;
      if (!data.opponent_user_id && isHost) newIndex = 3;
      else if (!data.host_user_id && !isHost) newIndex = 3;
      else if (matchStarted === 1) {
        if ((isHost && isHostReady && !isOpponentReady) || (!isHost && isOpponentReady && !isHostReady)) {
          setState((s) => ({ ...s, readyClick: true }));
          newIndex = 6;
        } else if (isScoreAdded) newIndex = 11;
        else if (isResultAdded) newIndex = 7;
        else newIndex = 6;
      } else if (matchStatus === "1") newIndex = 5;
      else {
        newIndex = CommonConstant.isFromChat
          ? CommonConstant.selectedMatchIndex
          : 4;
      }

      setState((s) => ({ ...s, selectedModelIndex: newIndex }));
    }
  }, [state.isDataShow]);
};

export default useInitGameState;
