"use client";

import TournamentModel from "@/components/TournamentModel";
import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import TournamentBracketModal from "@/components/TournamentBracket/bracketModel";
import EventEmitter from "@/components/EventEmitter";
import {
  availableMatchJoinAction,
  freeAvailableMatchJoinAction,
  freePlayMatchResultAction,
  freePlaySubmitScoreAction,
  freePlayUpdateMatchAction,
  freePlayUpdateReadyStatusAction,
  getCurrentTournamentMatchAction,
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
  tournamentMatchResultAction,
  tournamentSubmitScoreAction,
  updateMatchAction,
  updateReadyStatusAction,
  updateReadyTournamentStatusAction,
} from "@/redux/dashboard/action";
import {
  getConsoleData,
  getCurrentTourDetailsData,
  getCurrentTourRoundDetailsData,
  getData,
  getRoomData,
  getRoomId,
  getTournamentId,
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

const TournamentStart = () => {
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const { toaster } = useToaster();
  const dispatch = useDispatch();
  const router = useRouter();
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);
  const [amountData, setAmountData] = useState([]); // Initialize with null or some default value
  const [isModelShow, setIsModelShow] = useState(true); // Initialize with null or some default value
  const [roomData, setRoomData] = useState([]); // Initialize with null or some default value
  const [selectedModelIndex, setSelectedModelIndex] = useState(6);
  const [matchData, setMatchData] = useState("");
  const [ruleData, setRuleData] = useState("");
  const [readyTimes, setReadyTimer] = useState("");
  const [readyClick, setReadyClick] = useState(false);
  const [isMatchStart, setIsMatchStart] = useState(false);
  const [isSubmitScoreBtn, setIsSubmitScoreBtn] = useState(false);
  const [scoreTimeCount, setScoreTimeCount] = useState("");
  const [readyTimerData, setReadyTimerData] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [submitScoreDialog, setSubmitScoreDialog] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [tourRoundDetails, setTourRoundDetails] = useState(null);
  const [matchStatus, setMatchStatus] = useState("");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const getCurrentTime = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");
  var currentTourDetails = getCurrentTourDetailsData("tourDetailData");
  var currentTourRoundDetails =
    getCurrentTourRoundDetailsData("tournamentData");
  var tournamentNewData = getTournamentId("id");
  useEffect(() => {
    // Connect to the server
    // 54321
    setGameDetails(currentTourDetails);
    setTourRoundDetails(currentTourRoundDetails);
    getCurrentMatchStatus();
    if (SocketKEY.socketConnect === null) {
      socket.start();
      socket.subscribeUser();
    }
  }, []);

  useEffect(() => {
    console.log("selectedModelIndex", selectedModelIndex);
  }, [selectedModelIndex]);
  useEffect(() => {
    EventEmitter.on(EmitterKey.FoundMatch, (response) => {
      console.log("Event received: 78", response.message);
      console.log(
        "Event CommonConstant.CurrentGameDetails: 78",
        CommonConstant.CurrentGameDetails
      );

      if (response.message[0]?.matchCompleted) {
        CommonConstant.matchTournamentData = response.message[0];

        setTimeout(() => {
          setMatchData(response.message[0]);
          setSelectedModelIndex(9);
        }, 3000);
      }
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.TimerStart, (res) => {
      console.log("res.message.ready_status", res.message.ready_status);
      setReadyTimer(res.message.timer_sec);
      setReadyClick(res.message.ready_status === "0" ? false : true);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ReadySuccess, (res) => {
      console.log("res.timer_sec", res.message);
      setSelectedModelIndex(7);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ScoreWaitingTimer, (res) => {
      console.log("res.timer_sec", res.message);
      setScoreTimeCount(res.message.timer_sec);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.ReadyTimerStop, (res) => {
      console.log("res.ReadyTimerStop 126", res.message);
      setSelectedModelIndex(9);
      CommonConstant.matchTournamentData = res.message;
      setReadyTimerData(res.message);
      // setScoreTimeCount(res.message.timer_sec);
    });
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.AfterSubmit, (res) => {
      console.log("res.ReadyTimerStop 126", res.message);

      // setIsModelShow(false);

      setTimeout(() => {
        toaster(res.message.message, TOAST_TYPES.ERROR);
      }, 500);
      // setSelectedModelIndex(9);

      // setReadyTimerData(res.message);
    });
  }, []);
  useEffect(() => {}, []);

  const getRuleApi = async (gamId) => {
    setIsLoader(true);
    try {
      const res = await dispatch(getMatchRuleAction(gamId));

      console.log("res--> 118", res.payload.data.data);

      if (res.payload.data.data.length > 0) {
        setRuleData(res.payload.data.data);
        setIsLoader(false);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        setRuleData([]);

        console.log("res--> 133");

        // toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      //   toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getCurrentMatch = async (amountData, gameMode) => {
    setIsLoader(true);
    try {
      const res = await dispatch(getGameModeCurrentMatchAction());

      console.log("res--> 36", res);

      if (res.payload.statusCode == 200) {
        // if (res.payload.data.length == 0) {
        if (
          CommonConstant.FreePlayData.amount == "Free Play" ||
          CommonConstant?.FreePlayData?.amount == "free play"
        ) {
          freePlayMatchRequestCreateApi(amountData, gameMode);
        } else {
          matchRequestCreateApi(amountData, gameMode);
        }
        // }
        setIsLoader(false);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        console.log("res--> 133");

        // toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      //   toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const matchRequestCreateApi = async (amountData, gameMode) => {
    setIsLoader(true);
    setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");
      console.log("amountData", amountData);
      console.log("gameMode", gameMode);
      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);
      payload.append("amount", amountData.amount);
      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      payload.append("endTime", getCurrentTime());

      // const { res, status } = await dispatch(getMatchReqCreateAction(payload));
      const { payload: res } = await dispatch(getMatchReqCreateAction(payload));
      const { data, status } = res;
      // console.log("res--> 137", status);

      if (status) {
        console.log("status 137", status);

        setSelectedModelIndex(3);
        setIsLoader(false);
        // setIsLoading(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);

        setIsLoader(false);
        console.log("res--> 133");

        toaster(data.message, TOAST_TYPES.ERROR);
      }

      //   console.log("res", res);
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const freePlayMatchRequestCreateApi = async (amountData, gameMode) => {
    setIsLoader(true);
    setSelectedModelIndex(3);

    try {
      const user = getData("user");
      const consoleData = getConsoleData("consoleData");
      // console.log("amountData", amountData);
      console.log("gameMode", gameMode);
      const payload = new FormData();
      payload.append("host", user.data.id);
      payload.append("consoles", consoleData.id);
      payload.append("game", gameMode.game);
      payload.append("gamemodes", gameMode.id);
      // payload.append("amount", amountData.amount);
      payload.append("timezone_name", userTimeZone);
      payload.append("startTime", getCurrentTime());
      payload.append("endTime", getCurrentTime());

      // const { res, status } = await dispatch(getMatchReqCreateAction(payload));
      const { payload: res } = await dispatch(
        getFreePlayMatchReqCreateAction(payload)
      );
      const { data, status } = res;
      // console.log("res--> 137", status);
      console.log("🚀 ~ freePlayMatchRequestCreateApi ~ data:", data)

      if (status) {
        console.log("status 137", status);

        setSelectedModelIndex(3);
        setIsLoader(false);
        // setIsLoading(false);
        toaster(data.message, TOAST_TYPES.SUCCESS);
      } else {
        setSelectedModelIndex(2);

        setIsLoader(false);
        console.log("res--> 133");

        toaster(data.message, TOAST_TYPES.ERROR);
      }

      //   console.log("res", res);
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
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
      // console.log("res--> 137", status);

      if (status) {
        console.log("status 137", status);
        setSelectedModelIndex(6);
        setIsLoader(false);
      } else {
        setSelectedModelIndex(5);
        setIsLoader(false);
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
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
      // console.log("res--> 137", status);

      if (status) {
        console.log("status 137", status);
        setSelectedModelIndex(6);
        setIsLoader(false);
      } else {
        setSelectedModelIndex(5);
        setIsLoader(false);
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const updateReadyStatusApi = async () => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("id", gameDetails.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("ready_status", 1);

      const { payload: res } = await dispatch(
        updateReadyTournamentStatusAction(payload)
      );
      const { data, status } = res;
      // console.log("res--> 137", status);
      setIsLoader(false);
      if (status) {
        // setSelectedModelIndex(7);
        setReadyClick(true);
        setReadyTimer("");
      } else {
        // setSelectedModelIndex(6);

        setLoading(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const matchResultApi = async (winLosStatus) => {
    setIsLoader(true);
    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("id", gameDetails.match_request_id);
      payload.append("user_id", user.data.id);
      payload.append("result", winLosStatus);

      const { payload: res } = await dispatch(
        tournamentMatchResultAction(payload)
      );
      const { data, status } = res;
      console.log("res--> 137", status);
      console.log("data", data);
      setIsLoader(false);
      if (status) {
        setSelectedModelIndex(8);

        //setReadyTimer("");
      } else {
        setSelectedModelIndex(7);

        setIsLoader(false);
        toast.error(TOAST_ALERTS.OPPONENT_NOT_READY);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const submitScoreApi = async (score) => {
    setIsLoader(true);

    try {
      const user = getData("user");

      const payload = new FormData();
      payload.append("score_by_user", user.data.id);
      payload.append("match_request_id", gameDetails.match_request_id);
      payload.append("score", score);
      payload.append("endTime", getCurrentTime());

      const { payload: res } = await dispatch(
        tournamentSubmitScoreAction(payload)
      );
      const { data, status } = res;
      console.log("res--> 137", data);
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
      console.log("Error", error);
    }
  };

  function onPressAccept() {
    console.log("match data => ", matchData);
    console.log("match data => 782", CommonConstant.FreePlayData);
    console.log("match data => 783", CommonConstant.SelectedMatchData);
    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      console.log("match data =>  788");

      freePlayRequestUpdateCall(matchData.match_request_id, "1");
    } else {
      requestUpdateCall(matchData.match_request_id, "1");
    }
  }
  function onPressAcceptRules() {
    setIsMatchStart(true);
    console.log("CommonConstant.FreePlayData", CommonConstant.FreePlayData);
    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      console.log("freePlayRequestUpdateCall.FreePlayData 792");

      freePlayUpdateMatchStatusApi();
    } else {
      updateMatchStatusApi();
    }
  }
  function onPressDecline() {
    console.log("match data => onPressDecline call");
    console.log("CommonConstant.FreePlayData", CommonConstant.FreePlayData);

    // // console.log('match request Id => ', matchData.match_request_id)
    // // console.log('match status => ', 2)

    if (
      CommonConstant.FreePlayData?.amount == "free play" ||
      CommonConstant.SelectedMatchData?.amount == "free play" ||
      CommonConstant.FreePlayData?.amount == "Free Play" ||
      CommonConstant.SelectedMatchData?.amount == "Free Play"
    ) {
      console.log("freePlayRequestUpdateCall.FreePlayData");

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
    console.log("matchRequestUpdate obj =>", obj);
    response = await dispatch(getMatchReqUpdateAction(obj));
    console.log("response", response);
    setIsLoader(false);
    if (statusParam === "1") {
      console.log("rules screen calllll");
      setSelectedModelIndex(5);

      //Actions.push(ScreenName.RuleScreen, { gameRules: true });
    } else if (statusParam === "2") {
      setSelectedModelIndex(1);
      setIsModelShow(false);
      console.log("else if calling statusParam.........");
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
    console.log("matchRequestUpdate obj =>", obj);
    response = await dispatch(getFreePlayMatchReqUpdateAction(obj));
    console.log("response", response);
    setIsLoader(false);
    if (statusParam === "1") {
      console.log("rules screen calllll");
      setSelectedModelIndex(5);

      //Actions.push(ScreenName.RuleScreen, { gameRules: true });
    } else if (statusParam === "2") {
      setSelectedModelIndex(1);
      setIsModelShow(false);
      console.log("else if calling statusParam.........");
    }
  }

  const onClickAddItem = () => {
    setSelectedModelIndex(1);

    setIsModelShow(true);
    console.log("stateCode");
  };
  const closeModel = () => {
    setIsModelShow(false);

    console.log("stateCode");
  };
  const getCurrentMatchStatus = async () => {
    try {
      const object = {
        tour_id: tournamentNewData.id,
      };

      const { payload: res } = await dispatch(
        getCurrentTournamentMatchAction(object)
      );

      const { data, status } = res;
      if (status) {
        setMatchStatus(data?.tournamentData);
      }
    } catch (error) {
      console.log("Error fetching match status", error);
    }
  };

  const getEntryAmountApi = () => {};
  const getModelData = (amountData, gameMode) => {
    console.log("amountData", amountData);
    console.log("gameMode", gameMode);
    CommonConstant.FreePlayData = amountData;
    getRuleApi(gameMode.game);
    getCurrentMatch(amountData, gameMode);
  };

  const [showBracketModal, setShowBracketModal] = useState(false);

  return (
    <div>
      {/* {isLoader ? (
        <Loader />
      ) : ( */}
      <div className="h-screen bg-black06 relative">
        {/* View Bracket Button - Disabled until tournament starts - Top right corner */}
        <button
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-semibold transition z-50 ${
            matchStatus?.status === 0 
              ? "bg-gray82 text-gray-400 cursor-not-allowed" 
              : "bg-gray82 text-white hover:bg-gray-700 cursor-pointer"
          }`}
          onClick={matchStatus?.status !== 0 ? () => setShowBracketModal(true) : undefined}
          disabled={matchStatus?.status === 0}
        >
          View Bracket
        </button>
        {showBracketModal && (
          <TournamentBracketModal
            tournamentId={tournamentNewData?.id}
            onClose={() => setShowBracketModal(false)}
          />
        )}
        {isModelShow && (
          <TournamentModel
            isLoader={isLoader}
            amountData={amountData}
            closeModel={closeModel}
            getModelData={getModelData}
            gameModes={roomData?.gameModes}
            selectedIndex={selectedModelIndex}
            onPressAccept={onPressAccept}
            onPressDecline={onPressDecline}
            onPressAcceptRules={onPressAcceptRules}
            onPressReady={updateReadyStatusApi}
            ruleData={ruleData}
            readyTimes={readyTimes}
            readyClick={readyClick}
            matchResultApi={matchResultApi}
            submitScoreApi={submitScoreApi}
            scoreTimeCount={scoreTimeCount}
            isSubmitScoreBtn={isSubmitScoreBtn}
            matchData={matchData}
            readyTimerData={readyTimerData}
            submitScoreModel={submitScoreDialog}
            selectedMatchData={CommonConstant.SelectedMatchData}
          />
        )}
        <div className="  ml-8">
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

            setSelectedModelIndex(1);
            setIsModelShow(false);
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

export default TournamentStart;
