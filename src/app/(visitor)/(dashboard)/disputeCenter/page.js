"use client";

import { RHFTextInput } from "@/components/hook-form";
import { disputesListAction } from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { setDisputeData } from "@/utils/storage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
// import DisputeCenterAdsHorizontal from "@/components/Ads/adsense/DisputeCenterAdsHorizontal";

const DisputeCenter = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([
    // {
    //   id: 31,
    //   user: 0,
    //   disputereason: null,
    //   match: 18,
    //   details: "both user win",
    // },
  ]);
  const router = useRouter();

  useEffect(() => {
    getDisputesList();
  }, []);

  const getDisputesList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(disputesListAction());

      setIsLoader(false);

      if (res.payload.status) {
        setDisputeList(res.payload.data.data);
        //setChatData([...res.payload.data.data].reverse());
        // console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      console.log("Error", error);
    }
  };
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="min-h-screen  bg-black06">
          <div className="flex  justify-between items-center">
            {/* Title */}
            <p className="text-[24px] sm:text-[40px] text-white font-inter_tight font-[400] ml-[20px] pt-6 sm:pt-12 pb-6 sm:pb-12 text-center sm:text-left">
              Dispute Center
            </p>

            {/* Button */}
            <button
              onClick={() => {
                router.push(PATH_DASHBOARD.openCase);
              }}
              className="flex items-center text-black25 py-2 px-4 mt-4 sm:mt-0 w-36 sm:w-36 bg-yellow rounded-lg justify-center sm:justify-start mr-8 sm:mr-8"
            >
              <span className="mr-2">+</span>
              Open Case
            </button>
          </div>

          {/* Dispute center ads */}
          {/* <DisputeCenterAdsHorizontal /> */}

          <div className="bg-black06 pb-4">
            {disputeList.map((item) => {
              return (
                <div
                  onClick={() => {
                    router.push(PATH_DASHBOARD.disputeChat);
                    setDisputeData("dispute", item);
                  }}
                  className="w-[94%] bg-gray30 mb-2 rounded-lg ml-[3%] flex items-center p-4"
                >
                  <div className="rounded-lg  bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Image
                      className="rounded-lg  "
                      src={item?.gameData?.image}
                      width={140} // Matches Tailwind h-24 (96px)
                      height={140} // Matches Tailwind w-24 (96px)
                    />
                  </div>
                  <div className="ml-4 flex flex-col justify-between">
                    <p className="text-[12px] text-gray6E font-inter_tight font-[300]">
                      {moment
                        .utc(item.createdAt)
                        .local()
                        .format("MMM DD, YYYY hh:mm")}
                    </p>
                    <p className="text-[14px] text-white font-inter_tight font-[300] mt-1">
                      {item.regarding}
                    </p>
                    <button
                      className={
                        item.status === "0"
                          ? "btn-complete-red text-xs"
                          : item.status === "1"
                          ? "btn-complete-yellow text-xs"
                          : item.status === "2"
                          ? "btn-complete-green text-xs"
                          : "btn-complete-red text-xs"
                      }
                    >
                      {item.status === "0"
                        ? "Pending"
                        : item.status === "1"
                        ? "In Review"
                        : item.status === "2"
                        ? "Completed"
                        : "Rejected"}
                    </button>
                  </div>
                </div>
              );
            })}
            {disputeList.length == 0 && (
              <div className=" text-white text-3xl text-center pt-[20%]      h-screen">
                {"No Dispute Found"}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DisputeCenter;
