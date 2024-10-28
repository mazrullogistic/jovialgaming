"use client";

import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MatchRules = () => {
  const [tournamentData, setTournamentData] = useState([
    { image: "/images/photo.jpg" },
    { image: "/images/photo1.jpg" },
    { image: "/images/photo2.jpg" },
    { image: "/images/photo3.jpg" },
    { image: "/images/photo4.jpg" },
    { image: "/images/photo.jpg" },
    { image: "/images/photo1.jpg" },
    { image: "/images/photo2.jpg" },
    { image: "/images/photo3.jpg" },
    { image: "/images/photo4.jpg" },
  ]);

  return (
    <div className="h-screen bg-black06">
      <div class="rounded-xl h-56 w-96 bg-gray-300 flex items-center justify-center ml-12 pt-12">
        <img
          class="rounded-xl  h-full w-full object-cover"
          src={"/images/photo.jpg"}
          alt="Profile Picture"
        />
      </div>
      <p className="normal-bold-txt-match pt-20">Rules</p>
      <p className="normal-bold-txt-match">
        1. dlibhdsoi doiubd dpibd dpibd dpobds dpib dhvbdi did id imbue
        duyvivewfi e
      </p>
      <p className="normal-bold-txt-match">
        2. ouddp doiudo sipbsdoi sd dobsh died did ihbd
      </p>
      <p className="normal-bold-txt-match">
        3. divvy duydyfib cir oe cdi eri o8 ciro edp dcijdj ud kd ie cdcbifdkj
        di de edhbdk djh e eh ej dj cjd cjd cdj c
      </p>
    </div>
  );
};

export default MatchRules;
