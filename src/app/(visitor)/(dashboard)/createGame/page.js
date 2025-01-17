"use client";

import Model from "@/components/Model";
import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import EventEmitter from "@/components/EventEmitter";
import {
  availableMatchJoinAction,
  challengeFriendAction,
  deleteMatchAction,
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
  getMatchReqCreateAction,
  getMatchReqUpdateAction,
  getMatchReqUpdateMultiPlayerAction,
  getMatchRuleAction,
  getSearchUserAction,
  matchResultAction,
  submitScoreAction,
  updateMatchAction,
  updateReadyStatusAction,
} from "@/redux/dashboard/action";
import {
  getConsoleData,
  getCreate,
  getData,
  getRoomData,
  getRoomId,
} from "@/utils/storage";
import { setLoading } from "@/redux/dashboard/slice";
import {
  TOAST_ALERTS,
  TOAST_TYPES,
  EmitterKey,
  CommonConstant,
  SocketKEY,
} from "@/constants/keywords";
import { GetMatchReqCreate } from "@/redux/dashboard/services";
import { format } from "date-fns";
import socket from "@/socket/socket";
import AlertDialog from "@/components/AlertDialog";
import { useRouter } from "next/navigation";

const CreateGame = () => {
  const [isLoader, setIsLoader] = useState(true); // Initialize with null or some default value
  const { toaster } = useToaster();
  const router = useRouter();

  const dispatch = useDispatch();
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);
  const [amountData, setAmountData] = useState([]); // Initialize with null or some default value
  const [isModelShow, setIsModelShow] = useState(false); // Initialize with null or some default value
  const [roomData, setRoomData] = useState([]); // Initialize with null or some default value
  const [selectedModelIndex, setSelectedModelIndex] = useState(1);
  const [matchData, setMatchData] = useState("");
  const [ruleData, setRuleData] = useState("");
  const [readyTimes, setReadyTimer] = useState("");
  const [readyClick, setReadyClick] = useState(false);
  const [isMatchStart, setIsMatchStart] = useState(false);
  const [isWageringStop, setIsWageringStop] = useState(0);
  const [isSubscription, setIsSubscription] = useState("1");
  const [isDataShow, setIsDataShow] = useState(false);
  const [isSubmitScoreBtn, setIsSubmitScoreBtn] = useState(false);
  const [scoreTimeCount, setScoreTimeCount] = useState("");
  const [readyTimerData, setReadyTimerData] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [submitScoreDialog, setSubmitScoreDialog] = useState(false);
  const [currentMatchData, setCurrentMatchData] = useState([]);
  const [challengeUserDetail, setChallengeUserDetail] = useState([]);
  const [isChallenge, setIsChallenge] = useState(false);
  //User Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchData, setUserSearchData] = useState([]);
  const [notificationNumber, setNotificationNumber] = useState(0);

  console.log("userSearchData", userSearchData);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const getCurrentTime = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 2000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 2000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  useEffect(() => {
    if (CommonConstant.challengeData) {
      setIsChallenge(true);
      setIsModelShow(true);
      setChallengeUserDetail(CommonConstant.challengeData);
    } else {
      setIsChallenge(false);
      setChallengeUserDetail(null);
    }
    getCurrentMatches();

    return () => {};
  }, []);

  // useEffect(() => {
  //   connectSock();
  // }, []);

  // async function connectSock() {
  //   if (SocketKEY.socketConnect === null) {
  //     socket.start();
  //     socket.subscribeUser();
  //   }
  // }
  useEffect(() => {
    // Code to execute when the page is navigated to

    console.log("Screen is focused 135", CommonConstant.selectedMatchIndex);
    return () => {
      // Code to execute when navigating away from the page
      CommonConstant.isModelShow = false;
      CommonConstant.challengeData = null;
      console.log("Screen is unfocused 135");
    };
  }, [router.asPath]); // De
  useEffect(() => {
    if (CommonConstant.SelectedMatchData) {
      setIsModelShow(true);
      CommonConstant.FreePlayData = CommonConstant.SelectedMatchData;
      const user = getData("user");

      CommonConstant.CurrentGameDetails = CommonConstant.SelectedMatchData;
      setMatchData(CommonConstant.FreePlayData);
      console.log("matchData 137", CommonConstant.FreePlayData);
      getRuleApi(CommonConstant.SelectedMatchData.game);

      if (CommonConstant.SelectedMatchData.host === user.data.id) {
        if (!CommonConstant.SelectedMatchData.opponent_user_id) {
          setSelectedModelIndex(3);
        } else {
          if (CommonConstant.SelectedMatchData.start_match === 1) {
            if (CommonConstant.SelectedMatchData.host_ready_status === "1") {
              if (
                CommonConstant.SelectedMatchData.opponent_ready_status === "0"
              ) {
                setReadyClick(true);
                setSelectedModelIndex(6);
              } else {
                if (CommonConstant.SelectedMatchData.isScoreAddedHost) {
                  setSelectedModelIndex(11);
                } else {
                  setSelectedModelIndex(7);
                }
              }
            } else if (
              CommonConstant.SelectedMatchData.isResultAddedHost === "1"
            ) {
              setSelectedModelIndex(7);
            } else {
              setSelectedModelIndex(6);
            }
          } else if (CommonConstant.SelectedMatchData.status === "1") {
            setSelectedModelIndex(5);
          } else {
            setSelectedModelIndex(4);
            console.log("selected Index 183");
            if (CommonConstant.isFromChat) {
              setSelectedModelIndex(CommonConstant.selectedMatchIndex);
            }
            AvailableForJoinApi();
          }
        }
      } else {
        if (!CommonConstant.SelectedMatchData.host_user_id) {
          setSelectedModelIndex(3);
        } else {
          if (CommonConstant.SelectedMatchData.start_match1 === 1) {
            if (
              CommonConstant.SelectedMatchData.opponent_ready_status === "1"
            ) {
              if (CommonConstant.SelectedMatchData.host_ready_status === "0") {
                setReadyClick(true);
                setSelectedModelIndex(6);
              } else {
                if (CommonConstant.SelectedMatchData.isScoreAddedOpponent) {
                  setSelectedModelIndex(11);
                } else {
                  setSelectedModelIndex(7);
                }
              }
            } else if (
              CommonConstant.SelectedMatchData.isResultAddedOpponent === "1"
            ) {
              setSelectedModelIndex(7);
            } else {
              setSelectedModelIndex(6);
            }
          } else if (CommonConstant.SelectedMatchData.status1 === "1") {
            setSelectedModelIndex(5);
          } else {
            console.log("selected Index 215");

            setSelectedModelIndex(4);
            AvailableForJoinApi();
          }
        }
      }
    }

    return () => {};
  }, [isDataShow]);

  const getCurrentMatches = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getCurrentMatchesAction());

      if (res.payload.statusCode == 200) {
        setCurrentMatchData(res.payload.data);
        var create = getCreate("create");
        if (create) {
          //setIsModelShow(true);
        } else {
          //setIsModelShow(false);
        }
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  useEffect(() => {}, [selectedModelIndex]);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ChatReceive, (msg) => {
      console.log("msg", msg);
      setNotificationNumber(CommonConstant.notificationCount);
    });
    EventEmitter.on(EmitterKey.FoundMatch, (response) => {
      console.log("esponse.message[0] 239", response.message[0]);
      console.log(
        "CommonConstant.CurrentGameDetails",
        CommonConstant.CurrentGameDetails
      );
      CommonConstant.SelectedMatchData = CommonConstant.CurrentGameDetails;
      if (CommonConstant.CurrentGameDetails) {
        CommonConstant.CurrentGameDetails = response.message[0];
        CommonConstant.SelectedMatchData = response.message[0];
        if (response.message[0]?.matchCompleted) {
          setTimeout(() => {
            setMatchData(response.message[0]);
            console.log("matchData 246", response.message[0]);

            setSelectedModelIndex(9);
          }, 3000);
        } else {
          if (
            CommonConstant?.SelectedMatchData?.start_match !== 1 &&
            CommonConstant.SelectedMatchData?.status !== "1"
          ) {
            setMatchData(response.message);
            console.log("matchData 256", response.message);

            CommonConstant.CurrentGameDetails = response.message;
            CommonConstant.SelectedMatchData = response.message;
            setSelectedModelIndex(4);

            return;
          }

          setMatchData(response.message[0]);
          console.log("matchData 266", response.message[0]);

          setShowAlert(true);
        }
      } else {
        setMatchData(response.message);
        console.log("matchData 272", response.message);

        CommonConstant.CurrentGameDetails = response.message;
        setSelectedModelIndex(4);
      }
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.DeclineMatch, (message) => {
      setSelectedModelIndex(1);
      setIsModelShow(false);
      toaster(TOAST_ALERTS.OpponentDeclineMatchRequest, TOAST_TYPES.ERROR);
      getCurrentMatches();
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.TimerStart, (res) => {
      setReadyTimer(res.message.timer_sec);
      setReadyClick(res.message.ready_status === "0" ? false : true);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ReadySuccess, (res) => {
      setSelectedModelIndex(7);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ScoreWaitingTimer, (res) => {
      setScoreTimeCount(res.message.timer_sec);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ReadyTimerStop, (res) => {
      setSelectedModelIndex(9);

      setReadyTimerData(res.message);
      // setScoreTimeCount(res.message.timer_sec);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.AfterSubmit, (res) => {
      setIsModelShow(false);

      setTimeout(() => {
        toaster(res.message.message, TOAST_TYPES.ERROR);
      }, 500);
      // setSelectedModelIndex(9);

      // setReadyTimerData(res.message);
    });
  }, []);
  useEffect(() => {
    const roomData = getRoomData("roomData");
    setRoomData(roomData);
    getAmountDataApi();
  }, []);

  const getAmountDataApi = async () => {
    setIsLoader(true);
    try {
      const res = await dispatch(getEntryAmountAction());

      if (res.payload.statusCode == 200) {
        setAmountData(res.payload.data);
        setIsWageringStop(res.payload.isWageringStop);
        setIsSubscription(res.payload.isSubscription);
        if (CommonConstant.isModelShow) {
          setIsModelShow(true);
        }
        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  const getRuleApi = async (gamId) => {
    setIsLoader(true);
    try {
      const res = await dispatch(getMatchRuleAction(gamId));

      321;
      if (res.payload.data.data.length > 0) {
        setRuleData(res.payload.data.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        setRuleData([]);
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  const getCurrentMatch = async (amountData, gameMode) => {
    setIsLoader(true);
    try {
      const res = await dispatch(getGameModeCurrentMatchAction());

      if (res.payload.statusCode == 200) {
        if (
          CommonConstant.FreePlayData.amount == "Free Play" ||
          CommonConstant?.FreePlayData?.amount == "free play"
        ) {
          if (isChallenge) {
            FreePlayChallengeMatchRequestCreateApi(amountData, gameMode);
          } else {
            freePlayMatchRequestCreateApi(amountData, gameMode);
          }
        } else {
          if (isChallenge) {
            ChallengeMatchRequestCreateApi(amountData, gameMode);
          } else {
            matchRequestCreateApi(amountData, gameMode);
          }
        }
        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  const AvailableForJoinApi = async (amountData, gameMode) => {
    try {
      const user = getData("user");
      const payload = new FormData();
      payload.append("userId", user.data.id);
      payload.append(
        "game_type",
        CommonConstant.SelectedMatchData
          ? CommonConstant.SelectedMatchData.ismultipleuser
          : matchData.ismultipleuser
      );
      payload.append(
        "matchCommonId",
        CommonConstant.SelectedMatchData
          ? CommonConstant.SelectedMatchData.matchCommonId
          : matchData.matchCommonId
      );
      payload.append("is_old_delete", 0);
      payload.append("endTime", getCurrentTime());
      const { payload: res } = await dispatch(
        CommonConstant.SelectedMatchData.amount == "free play"
          ? freeAvailableMatchJoinAction(payload)
          : availableMatchJoinAction(payload)
      );

      const { data, status } = res;

      if (status) {
        setSelectedModelIndex(4);
        setIsLoader(false);
      } else {
        // setSelectedModelIndex(3);

        setIsLoader(false);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const matchRequestCreateApi = async (amountData, gameMode) => {
    setIsLoader(true);
    setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");

      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);
      payload.append("amount", amountData.amount);
      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(getMatchReqCreateAction(payload));
      const { data, status } = res;

      if (status) {
        getCurrentMatches();
        setSelectedModelIndex(3);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const ChallengeMatchRequestCreateApi = async (amountData, gameMode) => {
    setIsLoader(true);
    //setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");

      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);
      payload.append("amount", amountData.amount);

      payload.append("game_type", 0);
      payload.append("opponent", challengeUserDetail.id);

      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      // payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(challengeFriendAction(payload));
      const { data, status } = res;

      if (status) {
        getCurrentMatches();
        setIsModelShow(false);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const FreePlayChallengeMatchRequestCreateApi = async (
    amountData,
    gameMode
  ) => {
    setIsLoader(true);
    //  setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");

      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);

      payload.append("game_type", 0);
      payload.append("opponent", challengeUserDetail.id);

      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      // payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(fpChallengeFriendAction(payload));
      const { data, status } = res;

      if (status) {
        getCurrentMatches();
        setIsModelShow(false);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const freePlayMatchRequestCreateApi = async (amountData, gameMode) => {
    setIsLoader(true);
    setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");
      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);
      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(
        getFreePlayMatchReqCreateAction(payload)
      );
      const { data, status } = res;
      if (status) {
        getCurrentMatches();
        setSelectedModelIndex(3);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);
        setIsLoader(false);
        toaster(data.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setLoading(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const updateMatchStatusApi = async () => {
    setIsLoader(true);
    const payload = new FormData();

    try {
      payload.append("game_type", matchData.ismultipleuser);
      payload.append("match_request_id", matchData.match_request_id);
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(updateMatchAction(payload));
      const { data, status } = res;

      if (status) {
        setSelectedModelIndex(6);
        setIsLoader(false);
      } else {
        setSelectedModelIndex(5);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const freePlayUpdateMatchStatusApi = async () => {
    setIsLoader(true);
    const payload = new FormData();

    try {
      payload.append("game_type", matchData.ismultipleuser);
      payload.append("match_request_id", matchData.match_request_id);
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(
        freePlayUpdateMatchAction(payload)
      );
      const { data, status } = res;

      if (status) {
        setSelectedModelIndex(6);
        setIsLoader(false);
      } else {
        setSelectedModelIndex(5);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const updateReadyStatusApi = async () => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("id", matchData.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("ready_status", 1);

      const { payload: res } = await dispatch(updateReadyStatusAction(payload));
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setReadyClick(true);
        setReadyTimer("");
      } else {
        setLoading(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const freePlayUpdateReadyStatusApi = async () => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("id", matchData.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("ready_status", 1);

      const { payload: res } = await dispatch(
        freePlayUpdateReadyStatusAction(payload)
      );
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setReadyClick(true);
        setReadyTimer("");
      } else {
        setLoading(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const matchResultApi = async (winLosStatus) => {
    setIsLoader(true);
    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("id", matchData.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("result", winLosStatus);

      const { payload: res } = await dispatch(matchResultAction(payload));
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setSelectedModelIndex(8);
      } else {
        setSelectedModelIndex(7);
        setIsLoader(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const freePlayMatchResultApi = async (winLosStatus) => {
    setIsLoader(true);
    try {
      const user = getData("user");
      const payload = new FormData();
      payload.append("id", matchData.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("result", winLosStatus);

      const { payload: res } = await dispatch(
        freePlayMatchResultAction(payload)
      );
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setSelectedModelIndex(8);
      } else {
        setSelectedModelIndex(7);
        setIsLoader(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const submitScoreApi = async (score) => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("score_by_user", user.data.id);
      payload.append("match_request_id", matchData.match_request_id);
      payload.append("score", score);
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(submitScoreAction(payload));
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setIsSubmitScoreBtn(true);
      } else {
        setIsSubmitScoreBtn(false);

        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const freePlaySubmitScoreApi = async (score) => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("score_by_user", user.data.id);
      payload.append("match_request_id", matchData.match_request_id);
      payload.append("score", score);
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(
        freePlaySubmitScoreAction(payload)
      );
      const { data, status } = res;
      setIsLoader(false);
      if (status) {
        setIsSubmitScoreBtn(true);
      } else {
        setIsSubmitScoreBtn(false);

        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  function onPressAccept() {
    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      freePlayRequestUpdateCall(matchData.match_request_id, "1");
    } else {
      requestUpdateCall(matchData.match_request_id, "1");
    }
  }
  function onPressAcceptRules() {
    setIsMatchStart(true);
    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      freePlayUpdateMatchStatusApi();
    } else {
      updateMatchStatusApi();
    }
  }
  function onPressDecline() {
    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      freePlayRequestUpdateCall(matchData.match_request_id, "2");
    } else {
      requestUpdateCall(matchData.match_request_id, "2");
    }
  }

  async function requestUpdateCall(idParam, statusParam) {
    const user = getData("user");
    setIsLoader(true);
    const obj = new FormData();
    obj.append("id", idParam);
    obj.append("status", statusParam);
    obj.append("endTime", getCurrentTime());
    let response = null;

    obj.append("user_id", user.data.id);
    response = await dispatch(getMatchReqUpdateAction(obj));
    setIsLoader(false);
    if (statusParam === "1") {
      setSelectedModelIndex(5);

      //Actions.push(ScreenName.RuleScreen, { gameRules: true });
    } else if (statusParam === "2") {
      getCurrentMatches();

      setSelectedModelIndex(1);
      setIsModelShow(false);
    }
  }
  async function freePlayRequestUpdateCall(idParam, statusParam) {
    const user = getData("user");
    setIsLoader(true);
    const obj = new FormData();
    obj.append("id", idParam);
    obj.append("status", statusParam);
    obj.append("endTime", getCurrentTime());
    let response = null;

    obj.append("user_id", user.data.id);
    response = await dispatch(getFreePlayMatchReqUpdateAction(obj));
    setIsLoader(false);
    if (statusParam === "1") {
      setSelectedModelIndex(5);
    } else if (statusParam === "2") {
      getCurrentMatches();

      setSelectedModelIndex(1);
      setIsModelShow(false);
    }
  }

  const handleDelete = async (item) => {
    console.log("item", item);

    if (item.amount == "free play" || item.amount == "Free Play") {
      if (item) {
        try {
          const user = getData("user");

          const payload = new FormData();
          payload.append("game_type", item.ismultipleuser);
          payload.append("matchCommonId", item.matchCommonId);

          const { payload: res } = await dispatch(fPDeleteMatchAction(payload));
          const { data, status, message } = res;
          getCurrentMatches();
          console.log("data", res);
          toast.success(message);

          if (status) {
          } else {
            toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
          }
        } catch (error) {
          toast.error(TOAST_ALERTS.ERROR_MESSAGE);
        }
      }
    } else {
      if (item) {
        try {
          const user = getData("user");

          const payload = new FormData();
          payload.append("game_type", item.ismultipleuser);
          payload.append("matchCommonId", item.matchCommonId);

          const { payload: res } = await dispatch(deleteMatchAction(payload));
          const { data, status, message } = res;
          getCurrentMatches();
          console.log("data", data);
          if (status) {
          } else {
            toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
          }
        } catch (error) {
          toast.error(TOAST_ALERTS.ERROR_MESSAGE);
        }
      }
    }
  };
  const onClickAddItem = () => {
    setIsChallenge(false);
    setSelectedModelIndex(1);
    CommonConstant.isFromChat = false;
    CommonConstant.challengeData = null;

    setIsModelShow(true);
  };
  const closeModel = () => {
    setIsModelShow(false);
  };
  const getModelData = (amountData, gameMode) => {
    CommonConstant.FreePlayData = amountData;
    getRuleApi(gameMode.game);
    getCurrentMatch(amountData, gameMode);
  };

  //UserSearch API
  const getSearchUserList = async (name) => {
    const param = new FormData();
    param.append("name", name);

    try {
      const res = await dispatch(getSearchUserAction(param));

      if (res.payload.status) {
        setUserSearchData(res.payload.data.data);
      } else {
        setUserSearchData([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoader(false);
    }
  };

  const onChangeSearch = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);

    if (value !== "") {
      getSearchUserList(value);
    } else {
      setUserSearchData([]);
    }
  };

  return (
    <div>
      {isLoader && <Loader />}

      <div className="min-h-screen bg-black06">
        <div className="h-20 bg-black06 ml-8">
          <div className="flex items-center">
            <input
              name="email"
              value={searchTerm}
              placeholder="Search"
              onChange={onChangeSearch}
              className="textInput-search"
            />
            <button className="ml-6" onClick={onClickAddItem}>
              <Image
                src="/images/plus.png"
                className="plus-img"
                width={30}
                height={30}
                alt="Logo"
              />
            </button>
          </div>
        </div>
        {isLoader ? (
          <div className="flex justify-center items-center mt-4">
            Loading...
          </div>
        ) : (
          <div className="mt-4">
            {
              userSearchData.length > 0 ? (
                <ul className="list-none">
                  {userSearchData.map((user) => (
                    <div class="flex items-center  text-white rounded-lg p-4   mx-auto ml-10">
                      {console.log("user", user)}

                      <img
                        src={user?.image ? user?.image : "/images/logo.png"}
                        alt="User Image"
                        class="w-12 h-12 rounded-full object-cover"
                      />

                      <div class="ml-4 w-[45%] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        <p>{user.username}</p>
                      </div>

                      <button
                        className="  text-center border-[1px] rounded-lg text-black06 font-inter_tight bg-yellow    px-3 py-2"
                        onClick={() => {
                          setIsChallenge(true);
                          setChallengeUserDetail(user);
                          CommonConstant.challengeData = null;
                          setSelectedModelIndex(1);
                          setIsModelShow(true);
                        }}
                      >
                        Challenge
                      </button>
                    </div>
                  ))}
                </ul>
              ) : null
              /* <div className="text-center text-gray-500 mt-4">
                No results found.
              </div> */
            }
          </div>
        )}
        {isModelShow && (
          <Model
            isModelShow={isModelShow}
            isWageringStop={isWageringStop}
            isLoader={isLoader}
            amountData={amountData}
            closeModel={closeModel}
            getModelData={getModelData}
            gameModes={roomData.gameModes}
            selectedIndex={selectedModelIndex}
            onPressAccept={onPressAccept}
            onPressDecline={onPressDecline}
            onPressAcceptRules={onPressAcceptRules}
            onPressReady={
              CommonConstant?.FreePlayData?.amount == "free play" ||
              CommonConstant?.FreePlayData?.amount == "Free Play"
                ? freePlayUpdateReadyStatusApi
                : updateReadyStatusApi
            }
            ruleData={ruleData}
            readyTimes={readyTimes}
            readyClick={readyClick}
            matchResultApi={
              CommonConstant?.FreePlayData?.amount == "free play" ||
              CommonConstant?.FreePlayData?.amount == "Free Play"
                ? freePlayMatchResultApi
                : matchResultApi
            }
            submitScoreApi={
              CommonConstant?.FreePlayData?.amount == "free play" ||
              CommonConstant?.FreePlayData?.amount == "Free Play"
                ? freePlaySubmitScoreApi
                : submitScoreApi
            }
            scoreTimeCount={scoreTimeCount}
            isSubmitScoreBtn={isSubmitScoreBtn}
            matchData={matchData}
            readyTimerData={readyTimerData}
            submitScoreModel={submitScoreDialog}
            selectedMatchData={CommonConstant.SelectedMatchData}
            isSubscription={isSubscription}
            notificationNumber={notificationNumber}
            isChallenge={isChallenge}
          />
        )}
        <div className="mt-16  ml-8">
          <div className="match-small-carousel  ">
            {currentMatchData.length > 0 ? (
              <Carousel
                responsive={responsive}
                itemClass="carousel-item-padding-40-px"
                containerClass="ml-4  "
              >
                {currentMatchData.map((item) => {
                  return (
                    <div className="relative w-64 bg-black25 rounded-2xl pt-[1px]">
                      {/* Delete Icon */}
                      <button
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                        onClick={() => handleDelete(item)} // Replace with your delete function
                      >
                        <Image
                          src="/images/delete.svg" // Replace with your delete icon path
                          width={20}
                          height={20}
                          alt="Delete"
                        />
                      </button>

                      {/* Card Content */}
                      <div className="mt-[5%]">
                        <div className="flex">
                          <Image
                            src={item.game_image}
                            className="h-[40px] w-[40px] rounded-full ml-4"
                            width={40}
                            height={40}
                            alt={item.gamename}
                          />
                          <p className="text-[18px] text-white font-inter_tight font-[600] ml-14 mt-2">
                            {item.amount}
                          </p>
                        </div>
                        <p className="avl-txt">{item.gamename}</p>
                        <div className="flex">
                          <p className="avl-txt">{item.gameModeName}</p>
                        </div>
                        <p
                          className={`text-xs mt-2 ml-6 ${
                            item.isChallenges === "1"
                              ? "text-yellow"
                              : "text-black25"
                          }`}
                        >
                          {"Challenge By " + item?.host_name}
                        </p>

                        <div className="center-container">
                          <button
                            className="w-[80px] h-[35px] text-center border-[1px] rounded-full text-black06 font-inter_tight bg-yellow mb-4 mt-4"
                            onClick={() => {
                              // socket.start();
                              //socket.subscribeUser();
                              CommonConstant.isFromChat = false;
                              CommonConstant.SelectedMatchData = item;
                              setIsDataShow(!isDataShow);
                            }}
                          >
                            Join
                          </button>
                          {/* Text below the button */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              <p className="avl-txt">No Matches Available</p>
            )}
          </div>
          {/* {tournamentData.map((item) => {
            return (
              <div className="chat-container">
                <div class="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center">
                  <img
                    class="rounded-full h-full w-full object-cover"
                    src={item.image}
                    alt="Profile Picture"
                  />
                </div>
                <div className="w-[48%] ">
                  <p className="create-txt">{item.name}</p>
                </div>
                <div className="center-container  ">
                  <button className="btn-challenge">Challenge</button>
                </div>
              </div>
            );
          })} */}
        </div>
      </div>
      {/* )} */}
      {showAlert && (
        <AlertDialog
          title="Jovial Gaming"
          message={matchData?.display_message}
          onConfirm={() => {
            setMatchData("");
            CommonConstant.CurrentGameDetails = "";
            CommonConstant.SelectedMatchData = "";
            // socket.stop();
            getCurrentMatches();

            setSelectedModelIndex(1);
            setIsModelShow(false);
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

export default CreateGame;
