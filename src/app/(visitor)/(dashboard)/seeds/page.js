"use client";

import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Seeds = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);

  return (
    <div className="h-screen bg-black06">
      <div className="center-container">
        <p className="medium-txt-seeds">Seeds</p>
      </div>
      <div>
        {tournamentData.map((item) => {
          return (
            <div className="seeds-container">
              <p className="seeds-large-txt">{item.id}</p>

              <div class="rounded-full h-16 w-16 bg-gray-300 flex items-center justify-center">
                <img
                  class="rounded-full h-full w-full object-cover"
                  src={item.image}
                  alt="Profile Picture"
                />
              </div>
              <p className="seeds-txt">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="center-container mt-12">
        <button className="btn-join">Continue</button>
      </div>
    </div>
  );
};

export default Seeds;
