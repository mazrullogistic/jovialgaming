"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  getBadgesListAction,
  getGameHistoryAction,
  getSeasonListAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData } from "@/utils/storage";

const HistoryBook = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
  ]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [badgeList, setBadgeList] = useState([]);
  const user = getData("user");
  const [badgesSelect, setBadgesSelect] = useState(0);
  const [seasonModel, setSeasonModel] = useState(false);
  const [gameHistoryModel, setGameHistoryModel] = useState(false);
  const [seasonList, setSeasonList] = useState([]);
  const [gameHistoryList, setGameHistoryList] = useState([]);
  const [SeasonId, setSeasonId] = useState();
  const [SeasonName, setSeasonName] = useState();
  const [isSelectGame, setIsSelectGame] = useState(0);
  const [isSelectedSeason, setIsSelectedSeason] = useState(0);

  useEffect(() => {
    getBadgeList();
    getSeasonList();
    getGameHistoryList();
  }, []);
  const getSeasonList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getSeasonListAction());

      console.log("res--> 48", res.payload.data.data[0].name);
      console.log("res--> 152", res.payload.data.data[0].id);

      if (res.payload.status) {
        setSeasonList(res.payload.data.data);
        setSeasonId(res.payload.data.data[0].id);
        setIsLoader(false);
        setSeasonName(res.payload.data.data[0].name);

        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);

      console.log("Error", error);
    }
  };
  const getBadgeList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getBadgesListAction());

      console.log("res--> 152", res.payload.data);
      //console.log("res--> 152", res.payload.data.data[0].id);

      if (res.payload.status) {
        setBadgeList(res.payload.data.data);
        // setSeasonId(res.payload.data.data[0].id);
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);

      console.log("Error", error);
    }
  };
  const getGameHistoryList = async () => {
    setIsLoader(true);
    try {
      const res = await dispatch(getGameHistoryAction());

      setIsLoader(false);
      console.log("res--> 2451", res.payload);

      if (res.payload.status) {
        setGameHistoryList(res.payload.data.data);
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
  function SeasonModel() {
    console.log("seasonList", seasonList);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%] ml-[15%]">
        <span className="text-[22px]  font-[400] pl-4">{"Season"}</span>

        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {seasonList.map((game, index) => (
              <button
                key={index}
                className="flex justify-between"
                onClick={() => {
                  setSeasonId(game.id);
                  console.log("ids", game.id);
                  setSeasonModel(false);
                  setIsSelectedSeason(index);
                }}
              >
                <span
                  className={` ${
                    isSelectedSeason === index ? " text-yellow" : " text-white"
                  }`}
                >
                  {game.name}
                </span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setSeasonModel(false);
          }}
        >
          close
        </button>
      </div>
    );
  }
  function GameHistoryModel() {
    console.log("gameHistoryList", gameHistoryList);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%] ml-[15%]">
        <span className="text-[22px]  font-[400] pl-4">{"Games"}</span>

        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {gameHistoryList.map((game, index) => (
              <button
                key={index}
                className="flex justify-between"
                onClick={() => {
                  setIsSelectGame(index);
                  console.log("ids", game.id);
                  setGameHistoryModel(false);
                }}
              >
                <span
                  className={` ${
                    isSelectGame === index ? " text-yellow" : " text-white"
                  }`}
                >
                  {game.gamename}
                </span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setGameHistoryModel(false);
          }}
        >
          close
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black06 text-white relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4">
        {/* Filter Icon */}
        <button
          onClick={() => {
            setGameHistoryModel(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 12.414V19a1 1 0 01-.293.707l-3 3A1 1 0 018 21V12.414L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
        </button>
        {/* Dropdown */}
        <button
          onClick={() => {
            setSeasonModel(true);
          }}
          className="relative"
        >
          <div className="bg-black25 text-white border-none cursor-pointer focus:ring-0">
            {SeasonName}
          </div>
        </button>
        {/* Close Icon */}
        <div
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
        ></div>
      </div>
      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-black26 text-white p-4 rounded-md outline-none placeholder-white"
        />
      </div>
      {/* Circles */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 p-4">
        {badgeList.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setBadgesSelect(index);
              }}
              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                badgesSelect === index
                  ? "bg-black25 text-yellow"
                  : "bg-black25 text-white"
              }`}
            >
              {item.badgeLevel}
            </button>
          );
        })}
      </div>
      {seasonModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SeasonModel />
        </div>
      )}
      {gameHistoryModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <GameHistoryModel />
        </div>
      )}
    </div>
  );
};

export default HistoryBook;
