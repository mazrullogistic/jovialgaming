"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { getData, getRoomId } from "@/utils/storage";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import Head from "next/head";
import Script from "next/script";

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
      <Head>
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5381942317128703"
          crossOrigin="anonymous"></script> */}

          {/* // Multi script tag monetage */}
          <script src="https://kulroakonsu.net/88/tag.min.js" data-zone="142460" async data-cfasync="false"></script>


          {/* // happy tag intersitile monetage */}
          <script
          dangerouslySetInnerHTML={{
            __html: `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9201656,document.createElement('script'))`,
          }}
        />

      </Head>
      <Loader />
    </>
  );
};

export default Home;
