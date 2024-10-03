"use client";

import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MyProfile = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/badge.png" },
    { id: 2, name: "Quancinco", image: "/images/badge.png" },
    { id: 3, name: "Vonwill", image: "/images/badge.png" },
    { id: 4, name: "Muscleman", image: "/images/badge.png" },
  ]);

  return (
    <div className="h-screen bg-black06">
      <div className="center-container">
        <p className="medium-txt-seeds">Season 1 </p>
      </div>
      <div className="flex">
        <div class="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center ml-12 mt-8">
          <img
            class="rounded-full h-full w-full object-cover"
            src={"/images/seeds.png"}
            alt="Profile Picture"
          />
        </div>
        <div>
          <div className="flex">
            <p className="medium-txt-profile">JovialGamingSmash</p>
            <div className="center-container mt-12">
              <button className="btn-edit ml-14">Edit</button>
              <button className="btn-edit ml-4">Messages</button>
            </div>
          </div>
          <div className="flex ml-8">
            <p className="regular-txt-profile">W/L</p>
            <p className="regular-txt-profile-margin">BC</p>
            <p className="regular-txt-profile-margin">TW</p>
          </div>
          <div className="flex ml-8">
            <p className="regular-txt-profile">100-4</p>
            <p className="regular-txt-profile-margin">3</p>
            <p className="regular-txt-profile-margin">6</p>
          </div>
        </div>
      </div>
      <p className="regular-txt-profile-full">
        Winners Win and that is something I will always do, losers lose and that
        is something that they will always do #Gamer #JovialGaming
        #GGSmashplayer 👑🤑💸
      </p>
      <div className="border-[#474747] w-[100%] border-[1px] mt-8" />
      <div className="grid grid-cols-3 w-[42%]   ml-16 mt-4">
        {tournamentData.map((item) => {
          return (
            <div className="badge-container">
              <img
                class="rounded-xl h-full w-full object-cover"
                src={item.image}
                alt="Profile Picture"
              />
            </div>
          );
        })}
      </div>
      {/* <div className="center-container mt-12">
        <button className="btn-join">Continue</button>
      </div> */}
    </div>
  );
};

export default MyProfile;
