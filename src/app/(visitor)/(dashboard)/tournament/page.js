"use client";

import React, { useMemo, useState, useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import {
  getTournamentRulesAction,
  tournamentRegisterAction,
} from "@/redux/dashboard/action";
import { getData, getTournamentId } from "@/utils/storage";
import { setLoading } from "@/redux/dashboard/slice";
import {
  TOAST_ALERTS,
  TOAST_TYPES,
  CommonConstant,
} from "@/constants/keywords";
import { useRouter } from "next/navigation";

const Tournament = () => {
  const [isLoader, setIsLoader] = useState(true);
  const { toaster } = useToaster();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isModelShow, setIsModelShow] = useState(false);
  const [selectedModelIndex, setSelectedModelIndex] = useState(1);
  const [matchData, setMatchData] = useState("");
  const [ruleData, setRuleData] = useState([]);

  const [showAlert, setShowAlert] = useState(false);

  const [dataList, setConsoleList] = useState([
    { name: "Rules", value: "Rules" },
    { name: "Prizes", value: "Prizes" },
  ]);
  const [dropDownValue, setDropDownValue] = useState("Rules");
  const tournamentNewData = getTournamentId("id");
  const [IsMember, setIsMember] = useState(false);

  useEffect(() => {
    console.log("tournamentNewData", tournamentNewData);
    getTournamentRuleApi();
  }, []);

  const onPressContinue = () => {
    router.push("tournament/timer");
  };

  const RegisterApi = async () => {
    setIsLoader(true);
    try {
      const user = getData("user");
      const object = {
        tour_id: tournamentNewData.id,
        user_id: user.data.id,
      };

      const { payload: res } = await dispatch(tournamentRegisterAction(object));
      const { data, status } = res;
      setIsLoader(false);

      if (status) {
        router.push("tournament/timer");
        getTournamentRuleApi();
      } else {
        router.push("tournament/timer");
        toast.error(data.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const getTournamentRuleApi = async () => {
    setIsLoader(true);
    try {
      const tournamentId = getTournamentId("id");
      const res = await dispatch(getTournamentRulesAction(tournamentId.id));

      if (res.payload.data.data.length > 0) {
        setRuleData(res.payload.data.data);
        setIsMember(res.payload.data.isMember);
      } else {
        setRuleData([]);
      }
    } catch (error) {
      // Optionally toast error here
    } finally {
      setIsLoader(false);
    }
  };

  const handleChange = (event) => {
    const selectedOption = JSON.parse(event.target.value);
    setDropDownValue(selectedOption.value);
  };

  return (
    <div className="h-screen bg-black06 relative">
      {/* 🆕 View Bracket Button */}
      <button
        className="absolute top-4 right-4 bg-gray82 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
        onClick={() => router.push(`/tournament/bracket/${tournamentNewData?.id}`)}
      >
        View Bracket
      </button>

      {isLoader ? (
        <Loader />
      ) : (
        <div className="h-fit bg-black06 px-4 md:px-8">
          <div className="rounded-xl h-[264px] w-full sm:w-[384px] bg-gray-300 flex items-center justify-center mx-auto pt-12 sm:ml-16 md:ml-24">
            <img
              className="rounded-xl h-full w-full object-cover"
              src={tournamentNewData?.image}
              alt="Profile Picture"
            />
          </div>

          <select
            className="bg-black06 text-white text-lg w-full sm:w-1/2 md:w-40 h-8 mt-12 mx-auto block sm:ml-16 md:ml-24"
            onChange={handleChange}
          >
            {dataList.map((option, index) => (
              <option key={index} value={JSON.stringify(option)}>
                {option.name}
              </option>
            ))}
          </select>

          {dropDownValue === "Rules" ? (
            <div>
              {ruleData.map((option, index) => (
                <p
                  key={index}
                  className="text-lg text-white font-inter_tight font-light mt-8 mx-auto w-11/12 sm:w-3/4 md:w-[90%]"
                >
                  {option.descriptions}
                </p>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-lg text-white font-inter_tight font-light mt-8 mx-auto w-11/12 sm:w-3/4 md:w-2/3">
                {tournamentNewData?.tournament_price !== 0
                  ? "1. " + tournamentNewData?.tournament_price
                  : "No winning Amount"}
              </p>
              <p className="text-lg text-white font-inter_tight font-light mt-8 mx-auto w-11/12 sm:w-3/4 md:w-2/3">
                {tournamentNewData?.badgename &&
                tournamentNewData?.badgename !== null
                  ? "2. " + tournamentNewData?.badgename
                  : "No Winning Badge"}
              </p>
            </div>
          )}

          <button
            onClick={IsMember ? onPressContinue : RegisterApi}
            className="bg-yellow text-black06 px-4 py-1 rounded-full mx-auto mt-8 mb-16 block sm:w-1/2 md:w-1/3 lg:w-[10%]"
          >
            {IsMember ? "Continue" : "Register"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Tournament;
