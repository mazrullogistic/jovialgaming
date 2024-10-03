"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  matchHistoryListAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData } from "@/utils/storage";
import Loader from "@/components/Loader";

const MatchHistory = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
  ]);
  const matches = [
    {
      id: 1,
      game: "Warzone 2",
      result: "lost",
      score: -50,
      opponent: "mg",
      time: "Jul 18, 2024 09:45",
    },
    {
      id: 2,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:41",
    },
    {
      id: 3,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:37",
    },
    {
      id: 4,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:24",
    },
    {
      id: 5,
      game: "Warzone 2",
      result: "won",
      score: 200,
      opponent: "mg",
      time: "Jul 18, 2024 09:18",
    },
    {
      id: 1,
      game: "Warzone 2",
      result: "lost",
      score: -50,
      opponent: "mg",
      time: "Jul 18, 2024 09:45",
    },
    {
      id: 2,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:41",
    },
    {
      id: 3,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:37",
    },
    {
      id: 4,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:24",
    },
    {
      id: 5,
      game: "Warzone 2",
      result: "won",
      score: 200,
      opponent: "mg",
      time: "Jul 18, 2024 09:18",
    },
    {
      id: 1,
      game: "Warzone 2",
      result: "lost",
      score: -50,
      opponent: "mg",
      time: "Jul 18, 2024 09:45",
    },
    {
      id: 2,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:41",
    },
    {
      id: 3,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:37",
    },
    {
      id: 4,
      game: "Warzone 2",
      result: "lost",
      score: -100,
      opponent: "mg",
      time: "Jul 18, 2024 09:24",
    },
    {
      id: 5,
      game: "Warzone 2",
      result: "won",
      score: 200,
      opponent: "mg",
      time: "Jul 18, 2024 09:18",
    },
  ];
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [matchHistory, setMatchHistory] = useState([]);
  const user = getData("user");

  useEffect(() => {
    getMatchHistoryList();
  }, []);

  const getMatchHistoryList = async () => {
    setIsLoader(true);
    const payload = new FormData();
    payload.append("user_id", user.data.id);
    try {
      const res = await dispatch(matchHistoryListAction(payload));

      setIsLoader(false);

      if (res.payload.status) {
        setMatchHistory(res.payload.data.data);
        //setChatData([...res.payload.data.data].reverse());
        console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      console.log("Error", error);
    }
  };
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="bg-black06 min-h-screen p-4">
          <h1 className="text-white text-2xl font-semibold mb-4">
            Match History
          </h1>
          <div className="space-y-4">
            {matchHistory.map((match) => (
              <div
                key={match.id}
                className="bg-black26 p-4 rounded-lg flex items-center"
              >
                <img
                  src={match.image}
                  alt="Game"
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div className="text-white">
                  <h2 className="text-xl font-semibold">{match.gamename}</h2>
                  <p className="text-sm">
                    You{" "}
                    <span
                      className={
                        match.win_status === 1 ? "text-green" : "text-red"
                      }
                    >
                      {match.win_status === 1 ? "won " : "lost "}
                      {match.amount + " "}
                    </span>
                    against
                    {match.ismultipleuser !== 1 &&
                      ` ${
                        match.host === user.data.id
                          ? match.opponentName
                          : match.hostName
                      }`}
                  </p>
                  <p className="text-gray6E text-sm">
                    {moment
                      .utc(match.updatedAt)
                      .local()
                      .format("MMM DD, YYYY hh:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MatchHistory;
