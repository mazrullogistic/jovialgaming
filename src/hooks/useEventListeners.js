import { useEffect } from "react";
import EventEmitter from "@/components/EventEmitter";
import { CommonConstant, EmitterKey, TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";

const useEventListeners = (setState, setMatchData, getCurrentMatches) => {
  useEffect(() => {
    EventEmitter.on(EmitterKey.ChatReceive, () => {
      setState((s) => ({ ...s, notificationNumber: CommonConstant.notificationCount }));
    });

    EventEmitter.on(EmitterKey.FoundMatch, (res) => {
      getCurrentMatches();
      const match = res.message[0] || res.message;
      CommonConstant.SelectedMatchData = match;
      CommonConstant.CurrentGameDetails = match;

      if (match?.matchCompleted) {
        setTimeout(() => {
          setMatchData((m) => ({ ...m, current: match }));
          setState((s) => ({ ...s, selectedModelIndex: 9 }));
        }, 3000);
      } else {
        const notStarted = match.start_match !== 1 && match.status !== "1";
        setMatchData((m) => ({ ...m, current: match }));
        setState((s) => ({
          ...s,
          selectedModelIndex: notStarted ? 4 : 6,
          showAlert: !notStarted,
        }));
      }
    });

    EventEmitter.on(EmitterKey.DeclineMatch, () => {
      setState((s) => ({ ...s, selectedModelIndex: 2, isModelShow: false }));
      getCurrentMatches();
    });

    EventEmitter.on(EmitterKey.TimerStart, (res) => {
      setMatchData((m) => ({ ...m, readyTimes: res.message.timer_sec }));
      setState((s) => ({ ...s, readyClick: res.message.ready_status !== "0" }));
    });

    EventEmitter.on(EmitterKey.ReadySuccess, () => {
      setState((s) => ({ ...s, selectedModelIndex: 7 }));
    });

    EventEmitter.on(EmitterKey.ScoreWaitingTimer, (res) => {
      setMatchData((m) => ({ ...m, scoreTimeCount: res.message.timer_sec }));
    });

    EventEmitter.on(EmitterKey.ReadyTimerStop, (res) => {
      setState((s) => ({ ...s, selectedModelIndex: 9 }));
      setMatchData((m) => ({ ...m, readyTimerData: res.message }));
    });

    EventEmitter.on(EmitterKey.AfterSubmit, (res) => {
      setState((s) => ({ ...s, isModelShow: false }));
      setTimeout(() => {
        toast.error(res.message.message || TOAST_ALERTS.ERROR_MESSAGE);
      }, 500);
    });
  }, []);
};

export default useEventListeners;
