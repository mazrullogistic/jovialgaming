"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import NotificationDialog from "@/components/NotificationDialog";
import Loader from "@/components/Loader";
import {
  getData,
  removeData,
  setCreate,
  setRoomID,
  getRoomId,
  getRoomData,
  setMatchStorageData,
} from "@/utils/storage";
import { userData } from "@/redux/Auth/AuthSlice";
import {
  getProfileDataAction,
  leaveRoomAction,
} from "@/redux/dashboard/action";
import { TOAST_TYPES } from "@/constants/keywords";
import { toast } from "react-toastify";

import Model from "@/components/Model";
import { RHFTextInput } from "@/components/hook-form";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import EventEmitter from "@/components/EventEmitter";
import {
  availableMatchJoinAction,
  deleteMatchAction,
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
  matchResultAction,
  submitScoreAction,
  updateMatchAction,
  updateReadyStatusAction,
} from "@/redux/dashboard/action";
import { getConsoleData, getCreate } from "@/utils/storage";
import { setLoading } from "@/redux/dashboard/slice";
import {
  TOAST_ALERTS,
  EmitterKey,
  CommonConstant,
  SocketKEY,
} from "@/constants/keywords";
import { GetMatchReqCreate } from "@/redux/dashboard/services";
import { format } from "date-fns";
import socket from "@/socket/socket";
import AlertDialog from "@/components/AlertDialog";

export default function SideMenu({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoader, setIsLoader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [selectedItem, setSelectedItem] = useState("Home");
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [profileData, setProfileData] = useState(null); // Initialize with null or some default value

  const userDataNew = useSelector((state) => state.userData.userData);

  const menuRef = useRef(null); // Reference for the side menu
  useEffect(() => {
    // Only run this on the client side

    getProfile();
  }, []);
  useEffect(() => {
    const storedUser = getData("user");
    dispatch(userData(storedUser));
  }, [dispatch]);

  const { toaster } = useToaster();
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
    // connectSock();
  }, []);
  useEffect(() => {
    console.log("CommonConstant.isFromHome", CommonConstant.isFromHome);
  }, []);

  async function connectSock() {
    if (SocketKEY.socketConnect === null) {
      socket.start();
      socket.subscribeUser();
    }
  }

  useEffect(() => {
    if (CommonConstant.SelectedMatchData) {
      setIsModelShow(true);
      CommonConstant.FreePlayData = CommonConstant.SelectedMatchData;
      const user = getData("user");

      CommonConstant.CurrentGameDetails = CommonConstant.SelectedMatchData;
      setMatchData(CommonConstant.FreePlayData);
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
            setSelectedModelIndex(4);
            setSelectedModelIndex(CommonConstant.selectedMatchIndex);

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
          setIsModelShow(true);
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
    EventEmitter.on(EmitterKey.FoundMatch, (response) => {
      CommonConstant.SelectedMatchData = CommonConstant.CurrentGameDetails;
      if (CommonConstant.CurrentGameDetails) {
        CommonConstant.CurrentGameDetails = response.message[0];
        CommonConstant.SelectedMatchData = response.message[0];
        if (response.message[0]?.matchCompleted) {
          setTimeout(() => {
            setMatchData(response.message[0]);
            setSelectedModelIndex(9);
          }, 3000);
        } else {
          if (
            CommonConstant?.SelectedMatchData?.start_match !== 1 &&
            CommonConstant.SelectedMatchData?.status !== "1"
          ) {
            setMatchData(response.message);
            CommonConstant.CurrentGameDetails = response.message;
            CommonConstant.SelectedMatchData = response.message;
            setSelectedModelIndex(4);

            return;
          }

          setMatchData(response.message[0]);

          setShowAlert(true);
        }
      } else {
        setMatchData(response.message);
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
          freePlayMatchRequestCreateApi(amountData, gameMode);
        } else {
          matchRequestCreateApi(amountData, gameMode);
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
    router.push("/createGame");
    CommonConstant.isModelShow = true;
  };

  const closeModel = () => {
    setIsModelShow(false);
  };
  const getModelData = (amountData, gameMode) => {
    CommonConstant.FreePlayData = amountData;
    getRuleApi(gameMode.game);
    getCurrentMatch(amountData, gameMode);
  };

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close menu if the click is outside
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  const getProfile = async () => {
    try {
      const storedUser = getData("user");

      //const res = await dispatch(getGameByConsoleAction(param));
      const res = await dispatch(getProfileDataAction(storedUser?.data?.id));
      console.log("res.payload.data 72", res.payload.data);
      if (res.payload.status) {
        setProfileData(res.payload.data);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const logOut = () => {
    removeData("user");
    router.replace("/login");
  };

  const leaveRoomApi = async () => {
    setIsLoader(true);
    try {
      const roomId = getRoomId("roomId");
      const payload = new FormData();
      payload.append("roomId", roomId);
      const res = await dispatch(leaveRoomAction(payload));

      if (res.payload.status) {
        setRoomID("roomId", "");
        router.replace("/chooseRoom");
        toast.success(res.payload.message);
      } else {
        toast.error(res.payload.message);
      }
    } catch (error) {
      toast.error("Error leaving room.");
    } finally {
      setIsLoader(false);
    }
  };

  const menuItems = [
    { href: "/home", title: "Home", src: "/images/home.svg" },
    { href: "/messages", title: "Messages", src: "/images/chat.svg" },
    { href: "", title: "Notification", src: "/images/notification.svg" },
    {
      href: "/createGame",
      title: "Create",
      src: "/images/add.svg",
      onClick: () => {
        console.log("Create button clicked");
        // Add your custom logic here
      },
    },
    { href: "/ranking", title: "Ranking", src: "/images/trophywhite.svg" },
    {
      href: "/subscription",
      title: "Subscriptions",
      src: "/images/payment.svg",
    },
    {
      href: "/disputeCenter",
      title: "Dispute center",
      src: "/images/dispute.svg",
    },
    { href: "/about", title: "About", src: "/images/about.svg" },
  ];

  const handleMenuItemClick = (title) => {
    setSelectedItem(title);
    CommonConstant.isFromHome = false;
    CommonConstant.isFromChat = false;
    CommonConstant.challengeData = null;
    if (title === "Create") {
      console.log("Create button clicked");
      setMatchStorageData("matchData", "");
    }
    if (title === "Create") setCreate("create", "");

    if (title === "Notification") setOpenNotificationDialog(true);
    setMenuOpen(false); // Close menu after selecting an item
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isLoader ? (
        <Loader />
      ) : (
        <>
          {/* Mobile menu toggle */}
          <div className="bg-black06 flex items-center">
            <button
              className="md:hidden bg-black06 text-white p-3 w-12"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <button
              className="ml-auto mb-4 mr-4 md:hidden"
              onClick={onClickAddItem}
            >
              <Image
                src="/images/plus.png"
                className="plus-img"
                width={18}
                height={18}
                alt="Logo"
              />
            </button>
          </div>

          {/* Sidebar */}
          <div
            ref={menuRef} // Reference for the menu div
            className={`fixed md:static top-0 left-0 bg-black06 transition-transform transform ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 z-50 w-3/4 md:w-[16%] h-screen overflow-y-auto border-b-2 md:border-b-0 md:border-r-2 border-[#474747]`}
          >
            <Image
              src="/images/logo.png"
              className="logo-img ml-12"
              width={45}
              height={45}
              alt="Logo"
            />
            <button
              onClick={() => router.push("/profileCard")}
              className="flex flex-col md:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="flex-shrink-0">
                <img
                  src={userDataNew?.data?.image}
                  alt="Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover max-w-full"
                />
              </div>
              <div className="text-white text-center md:text-left">
                <p className="text-base md:text-lg font-semibold">
                  {userDataNew?.data?.username}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  ${profileData?.data?.balance}
                </p>
              </div>
            </button>
            <nav>
              <ul className="space-y-4 p-4">
                {menuItems.map(({ href, title, src }) => (
                  <li key={title}>
                    <Link href={href} passHref>
                      <div
                        className={`flex items-center space-x-3 md:mt-12 ml-2 ${
                          selectedItem === title
                            ? "text-blue-500"
                            : "text-white"
                        }`}
                        onClick={() => handleMenuItemClick(title)}
                      >
                        <Image src={src} alt={title} width={24} height={24} />
                        <span>{title}</span>
                      </div>
                    </Link>
                  </li>
                ))}
                <div>
                  <li
                    className="flex items-center space-x-3 text-white cursor-pointer  ml-2 md:mt-10"
                    onClick={leaveRoomApi}
                  >
                    <Image
                      src="/images/leaveroom.svg"
                      alt="Leave Room"
                      width={24}
                      height={24}
                    />
                    <span>Leave Room</span>
                  </li>
                </div>
                <div>
                  <li
                    className="flex items-center space-x-3 text-white cursor-pointer md:mt-10 ml-2"
                    onClick={logOut}
                  >
                    <Image
                      src="/images/logout.svg"
                      alt="Logout"
                      width={24}
                      height={24}
                    />
                    <span>Logout</span>
                  </li>
                </div>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:w-[84%] h-screen overflow-y-auto">
            <main className="overflow-y-auto">{children}</main>
          </div>
        </>
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
        />
      )}
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
      <NotificationDialog
        open={openNotificationDialog}
        onClose={() => setOpenNotificationDialog(false)}
      />
    </div>
  );
}
