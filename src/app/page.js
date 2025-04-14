"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { getData, getRoomId } from "@/utils/storage";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import Head from "next/head";

const Home = () => {
  const route = useRouter();

  useEffect(() => {
    const user = getData("user");
    const roomId = getRoomId("roomId");

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
      {/* <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5381942317128703"
          crossOrigin="anonymous"></script>
      </Head> */}
      <Loader />
    </>
  );
};

export default Home;
