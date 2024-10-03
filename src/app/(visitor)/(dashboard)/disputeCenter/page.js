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

const DisputeCenter = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
  ]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
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
        console.log("res--> 2451", res.payload.data.data);
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
        <div className="h-full  bg-black06">
          <div className="flex justify-between items-center  ">
            <p className="medium-txt-dispute">Dispute Center</p>
            <button
              onClick={() => {
                router.push(PATH_DASHBOARD.openCase);
              }}
              className="flex items-center bg-blue-500 text-black25 py-2 px-4 mr-8 bg-yellow rounded-lg"
            >
              <span className="mr-2">+</span>
              Open Case
            </button>
          </div>
          <div className="bg-black06 pb-4">
            {disputeList.map((item) => {
              return (
                <div
                  onClick={() => {
                    router.push(PATH_DASHBOARD.disputeChat);

                    setDisputeData("dispute", item);
                  }}
                  className="sub-container-dispute"
                >
                  <div className="rounded-2xl h-44 w-32 bg-gray-300 flex items-center justify-center pt-4 pl-4">
                    <img
                      className="rounded-2xl h-full w-full object-cover"
                      src={item.gameData.image}
                      alt="Profile Picture"
                    />
                  </div>
                  <div>
                    <p className="dispute-txt">
                      {moment
                        .utc(item.createdAt)
                        .local()
                        .format("MMM DD, YYYY hh:mm")}
                    </p>
                    <p className="dispute-white-txt">{item.regarding}</p>
                    <button
                      className={
                        item.status === "0"
                          ? "btn-complete-red"
                          : item.status === "1"
                          ? "btn-complete-yellow"
                          : item.status === "2"
                          ? "btn-complete-green"
                          : "btn-complete-red"
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
          </div>
        </div>
      )}
    </>
  );
};

export default DisputeCenter;
