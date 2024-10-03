"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { getData, getRoomId } from "@/utils/storage";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";

const Home = () => {
  const route = useRouter();

  useEffect(() => {
    const user = getData("user");
    const roomId = getRoomId("roomId");

    console.log("roomId 13", user?.roomId);
    console.log("user 13", user?.token);
    if (user?.token) {
      // route.replace("/home");
      if (roomId) {
        route.replace(PATH_DASHBOARD.home);
      } else {
        route.replace(PATH_DASHBOARD.chooseRoom);
      }
    } else {
      route.replace(PATH_AUTH.login);
    }
  }, []);

  // States
  return (
    <>
      <Loader />
    </>
  );
};

export default Home;
