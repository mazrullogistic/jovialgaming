"use client";

import { RHFTextInput } from "@/components/hook-form";
import { TOAST_ALERTS } from "@/constants/keywords";
import {
  getCurrentTournamentMatchAction,
  getRegisterUserListAction,
  getUpdateStartMatchAction,
} from "@/redux/dashboard/action";
import { getData, getTournamentId } from "@/utils/storage";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import TournamentBracketModal from '@/components/TournamentBracket/bracketModel';

const Seeds = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);
  var tournamentNewData = getTournamentId("id");
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [isLoader, setIsLoader] = useState(true); // Initialize with null or some default value
  const [matchStatus, setMatchStatus] = useState("");
  const router = useRouter();
  const [showBracketModal, setShowBracketModal] = useState(false);

  useEffect(() => {
    RegisterUserList();
    getCurrentMatchStatus();
  }, []);

  const RegisterUserList = async () => {
    try {
      const user = getData("user");
      setIsLoader(true);
      const object = {
        tour_id: tournamentNewData.id,
        round: 0,
      };

      const { payload: res } = await dispatch(
        getRegisterUserListAction(object)
      );

      const { data, status } = res;
      console.log("data", data);
      setIsLoader(false);

      if (status) {
        console.log("status 137", status);
        console.log("found match 427");
        setUserList(data.data);
      } else {
        console.log("res--> 133", data);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
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

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="h-screen bg-black06 relative">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white bg-gray-900 p-2 rounded-lg hover:bg-gray-700 transition  pt-8 pl-8"
          >
            <ArrowLeftIcon className="h-6 w-6 text-white" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* View Bracket Button - Disabled until tournament starts - Top right corner */}
          <button
            className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-semibold transition ${
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
          <div className="center-container">
            <p className="medium-txt-seeds">Seeds</p>
          </div>
          <div>
            {userList.map((item, index) => {
              return (
                <div className="seeds-container">
                  <p className="seeds-large-txt">{index + 1}</p>

                  <div class="rounded-full h-16 w-16 bg-gray-300 flex items-center justify-center">
                    <img
                      class="rounded-full h-full w-full object-cover"
                      src={item.image}
                      alt="Profile Picture"
                    />
                  </div>
                  <p className="seeds-txt">{item.username}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Seeds;
