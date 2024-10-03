"use client";

import { RHFTextInput } from "@/components/hook-form";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Clock = () => {
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
      <div className="center-container">
        <p className="normal-txt-match">Tournament begins</p>
      </div>
      <div className="center-container">
        <p className="medium-txt-match">04:05:24:01</p>
      </div>
      <div className="center-container">
        <p className="blue-txt-match">Seeds</p>
      </div>
      <div className="center-container mt-42345">
        <button className="btn-join">Continue</button>
      </div>
    </div>
  );
};

export default Clock;
