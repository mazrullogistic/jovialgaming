"use client";

import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MatchUsers = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);

  return (
    <div className="h-screen flex">
      <p className="match-time-txt">{"4:29"}</p>
      <p className="match-vs-txt">{"VS"}</p>
      <button className="btn-ready">READY</button>

      <div className="w-[50%] bg-gray69 h-screen pl-[30%] pt-[15%]">
        <div class="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
          <img
            class="rounded-full h-full w-full object-cover"
            src={"/images/seeds.png"}
            alt="Profile Picture"
          />
        </div>
        <p className="match-txt">{"Juswoo"}</p>
      </div>
      <div className="w-[50%] bg-black06 h-screen pl-[15%] pt-[15%]">
        <div class="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
          <img
            class="rounded-full h-full w-full object-cover"
            src={"/images/seeds.png"}
            alt="Profile Picture"
          />
        </div>
        <p className="match-txt">{"Juswoo"}</p>
      </div>
    </div>
  );
};

export default MatchUsers;
