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
  const [isLoader, setIsLoader] = useState(true); // Initialize with null or some default value
  const { toaster } = useToaster();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isModelShow, setIsModelShow] = useState(false); // Initialize with null or some default value
  const [selectedModelIndex, setSelectedModelIndex] = useState(1);
  const [matchData, setMatchData] = useState("");
  const [ruleData, setRuleData] = useState([]);

  const [showAlert, setShowAlert] = useState(false);

  //new
  const [dataList, setConsoleList] = useState([
    { name: "Rules", value: "Rules" },
    { name: "Prizes", value: "Prizes" },
  ]);
  const [dropDownValue, setDropDownValue] = useState("Rules");
  var tournamentNewData = getTournamentId("id");
  const [IsMember, setIsMember] = useState(false);

  useEffect(() => {
    console.log("selectedModelIndex", selectedModelIndex);
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
        console.log("status 137", status);
        console.log("found match 427");
        getTournamentRuleApi();
      } else {
        setIsLoader(false);
        console.log("res--> 133", data);
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const getTournamentRuleApi = async () => {
    setIsLoader(true);
    try {
      var tournamentId = getTournamentId("id");

      const res = await dispatch(getTournamentRulesAction(tournamentId.id));

      console.log("res--> 118", res.payload.data.data);

      if (res.payload.data.data.length > 0) {
        setRuleData(res.payload.data.data);
        setIsMember(res.payload.data.isMember);
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
  const handleChange = (event) => {
    const selectedOption = JSON.parse(event.target.value);
    console.log("selectedOption", selectedOption);
    setDropDownValue(selectedOption.value);
  };
  return (
    <div>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="h-screen  bg-black06">
          <div class="rounded-xl h-[264px] w-[384px] bg-gray-300 flex items-center justify-center ml-12 pt-12">
            <img
              class="rounded-xl h-full w-full object-cover"
              src={tournamentNewData.image}
              alt="Profile Picture"
            />
          </div>

          <select
            className=" bg-black06 text-white text-[22px]   w-24  h-8  ml-12 mt-12 "
            onChange={handleChange}
          >
            {dataList.map((option, index) => (
              <option key={index} value={JSON.stringify(option)}>
                {option.name}
              </option>
            ))}
          </select>
          {dropDownValue == "Rules" ? (
            <div>
              {ruleData.map((option, index) => (
                <p className="normal-bold-txt-match">{option.descriptions}</p>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-[16px] text-white  font-inter_tight font-[200] ml-12 mt-8 w-[50%]">
                {tournamentNewData.tournament_price !== 0
                  ? "1. " + tournamentNewData.tournament_price
                  : "No winning Amount"}
              </p>
              <p className="text-[16px] text-white  font-inter_tight font-[200] ml-12 mt-8 w-[50%]">
                {tournamentNewData.badgename !== "" &&
                tournamentNewData.badgename !== null
                  ? "2. " + tournamentNewData.badgename
                  : "No Winning Badge"}
              </p>{" "}
            </div>
          )}

          <button
            onClick={IsMember ? onPressContinue : RegisterApi}
            className="bg-yellow text-black06 px-6 py-2 rounded-full ml-[40%] mt-16"
          >
            {IsMember ? "Continue" : "Register"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Tournament;
