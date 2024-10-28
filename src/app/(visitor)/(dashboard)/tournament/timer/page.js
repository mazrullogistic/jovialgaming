"use client";

import React, { useMemo, useState, useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import {
  getCurrentTournamentMatchAction,
  getTournamentRulesAction,
  getUpdateStartMatchAction,
  tournamentRegisterAction,
} from "@/redux/dashboard/action";
import {
  getData,
  getTournamentId,
  setCurrentTourDetailsData,
  setCurrentTourRoundDetailsData,
} from "@/utils/storage";
import { setLoading } from "@/redux/dashboard/slice";
import {
  TOAST_ALERTS,
  TOAST_TYPES,
  CommonConstant,
  SocketKEY,
  EmitterKey,
} from "@/constants/keywords";
import momentTimezone from "moment-timezone";
import moment from "moment";
import { useRouter } from "next/navigation";
import socket from "@/socket/socket";
import EventEmitter from "@/components/EventEmitter";
import { format } from "date-fns";

const Timer = () => {
  const [isLoader, setIsLoader] = useState(true); // Initialize with null or some default value
  const { toaster } = useToaster();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isModelShow, setIsModelShow] = useState(false); // Initialize with null or some default value
  const [selectedModelIndex, setSelectedModelIndex] = useState(1);
  const [matchStatus, setMatchStatus] = useState("");
  const [ruleData, setRuleData] = useState([]);
  const [timerBy, setTimerBy] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  //new
  const [dataList, setConsoleList] = useState([
    { name: "Rules", value: "Rules" },
    { name: "Prizes", value: "Prizes" },
  ]);
  const [dropDownValue, setDropDownValue] = useState("Rules");
  var tournamentNewData = getTournamentId("id");
  const [IsMember, setIsMember] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 8,
    minutes: 38,
    seconds: 57,
  });
  const [checkStatus, setCheckStatus] = useState({});
  const [currentMatch, setCurrentMatch] = useState({});
  const getCurrentTime = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");

  useEffect(() => {
    // Connect to the server
    // 54321
    console.log("tournamentNewData", tournamentNewData);
    if (SocketKEY.socketConnect === null) {
      socket.start();
      socket.subscribeUser();
    }
  }, []);
  useEffect(() => {
    EventEmitter.on(EmitterKey.TournamentStart, (res) => {
      console.log("res.timer_sec", res.message);
      getCurrentMatchStatus();
    });
  }, []);

  useEffect(() => {
    getCurrentMatchStatus();

    const interval = setInterval(() => {
      const currentTime = momentTimezone()
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");

      const sDate = moment(tournamentNewData.startdate).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const diff = moment(tournamentNewData.startdate).diff(currentTime);
      if (diff <= 0) {
        checkStatus.status = 1;
        clearInterval(interval);
        setTimerBy("Waiting for the next match");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        setTimerBy(countdownText);
      }
    }, 1000);
  }, []);
  const updateStartMatchApi = async () => {
    setIsLoader(true);

    const payload = new FormData();
    payload.append("game_type", 0);
    payload.append("match_request_id", currentMatch.match_request_id);
    payload.append("endTime", getCurrentTime());

    try {
      const res = await dispatch(getUpdateStartMatchAction(payload));
      setIsLoader(false);

      if (res.payload.status) {
        //setChatData([...res.payload.data.data].reverse());
        router.push("/tournament/timer/tournamentStart");
        console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);

      console.log("Error", error);
    }
  };
  const getCurrentMatchStatus = async () => {
    setIsLoader(true);
    try {
      const user = getData("user");

      const object = {
        tour_id: tournamentNewData.id,
      };

      const { payload: res } = await dispatch(
        getCurrentTournamentMatchAction(object)
      );
      setIsLoader(false);

      const { data, status } = res;
      console.log("data?.response?.data?.data", data.tournamentData);
      console.log("data?.response?.data?.tournamentData", data.data);
      if (status) {
        setMatchStatus(data?.tournamentData);
        setCurrentMatch(data?.data);
        setCurrentTourDetailsData("tourDetailData", data?.data);
        setCurrentTourRoundDetailsData("tournamentData", data?.tournamentData);
      } else {
        setIsLoader(false);
        setCurrentMatch({});
        setMatchStatus(data?.response?.data?.tournamentData);

        console.log("res--> 133", data);
        toast.error(data.response.data.message);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const onPressContinue = async () => {
    if (currentMatch) {
      console.log("currentMatch?.length", currentMatch?.length);
      updateStartMatchApi();
    }
  };

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-black26 text-white relative">
          <button className="absolute top-4 right-4">
            {/* <img
              src={"/images/chat.svg"}
              className="w-6 h-6"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(92%) sepia(100%) saturate(646%) hue-rotate(1deg) brightness(106%) contrast(106%)",
              }}
              alt="Chat Icon"
            /> */}
          </button>
          <div className="w-full max-w-md p-6 relative">
            {/* Chat Icon */}

            {/* Main Content */}
            <div className="text-center">
              <h1 className="text-2xl mb-4">Tournament begins in:</h1>
              <div className="text-4xl font-bold mb-4">
                {matchStatus?.status === 0 ? timerBy : ""}
              </div>
              <button
                onClick={() => {
                  router.push("/tournament/timer/seeds");
                }}
              >
                <p className="text-xl mb-8">Seeds</p>
              </button>
            </div>

            <button
              onClick={onPressContinue}
              className={`w-full py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors ${
                currentMatch ? "bg-gray82" : "bg-yellow"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
