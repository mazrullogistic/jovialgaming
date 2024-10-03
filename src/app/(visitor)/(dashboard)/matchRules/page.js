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
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="h-screen bg-black06">
      <p className="bold-txt-match">Match Rules:</p>

      <p className="semi-bold-txt-match">1v1 Sudden Death</p>
      <p className="normal-bold-txt-match">
        Match up in a 1v1 head up fight. 1 stock , 7:00 Min. No items. Last man
        standing cashes out! Very simple In the event of a tie whoever has the
        lowest percent wins!
      </p>
      <p className="semi-bold-txt-match">1v1 Smash Battle</p>
      <p className="normal-bold-txt-match">
        Game settings 1 v 1 - 3 Stock Last Man standing Wins
      </p>
    </div>
  );
};

export default MatchRules;
