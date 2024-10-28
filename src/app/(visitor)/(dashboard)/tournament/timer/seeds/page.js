"use client";

import { RHFTextInput } from "@/components/hook-form";
import { TOAST_ALERTS } from "@/constants/keywords";
import {
  getRegisterUserListAction,
  getUpdateStartMatchAction,
} from "@/redux/dashboard/action";
import { getData, getTournamentId } from "@/utils/storage";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";

const Seeds = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);
  var tournamentNewData = getTournamentId("id");
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [isLoader, setIsLoader] = useState(true); // Initialize with null or some default value

  useEffect(() => {
    RegisterUserList();
  }, []);

  const RegisterUserList = async () => {
    try {
      const user = getData("user");
      setIsLoader(true);
      const object = {
        tour_id: tournamentNewData.id,
        round: 0,
      };

      const { payload: res } = await dispatch(
        getRegisterUserListAction(object)
      );

      const { data, status } = res;
      console.log("data", data);
      setIsLoader(false);

      if (status) {
        console.log("status 137", status);
        console.log("found match 427");
        setUserList(data.data);
      } else {
        console.log("res--> 133", data);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="h-screen bg-black06">
          <div className="center-container">
            <p className="medium-txt-seeds">Seeds</p>
          </div>
          <div>
            {userList.map((item, index) => {
              return (
                <div className="seeds-container">
                  <p className="seeds-large-txt">{index + 1}</p>

                  <div class="rounded-full h-16 w-16 bg-gray-300 flex items-center justify-center">
                    <img
                      class="rounded-full h-full w-full object-cover"
                      src={item.image}
                      alt="Profile Picture"
                    />
                  </div>
                  <p className="seeds-txt">{item.username}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Seeds;
