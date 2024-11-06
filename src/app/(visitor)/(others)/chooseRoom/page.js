"use client";

import { RHFTextInput } from "@/components/hook-form";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import { getRoomList, selectRoomAction } from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useToaster from "@/hooks/useToaster";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import {
  getData,
  removeData,
  saveData,
  setRoomData,
  setRoomID,
} from "@/utils/storage";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";

const ChooseRoom = () => {
  const dispatch = useDispatch();
  const { toaster } = useToaster();
  // const isLoader = useSelector((state) => state.dashboardReducer.isLoading);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("isLoader", isLoader);
    getGameListApi();

    return () => {};
  }, []);

  const [tournamentData, setTournamentData] = useState([]);
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

  const getGameListApi = async () => {
    setIsLoading(true);

    try {
      const res = await dispatch(getRoomList());

      console.log("res-->", res);
      console.log("statusCode-->", res.payload.statusCode);

      if (res.payload.statusCode == 200) {
        setIsLoading(false);
        setTournamentData(res.payload.data);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoading(false);
        console.log("res--> 133");

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const selectRoomApi = (item) => async () => {
    setIsLoading(true);
    console.log("item", item);
    const user = getData("user");
    console.log("user", JSON.stringify(user));

    const updatedData = { ...user, roomDetails: item };
    saveData("user", updatedData);

    try {
      const payload = new FormData();
      payload.append("roomId", item.id);
      const res = await dispatch(selectRoomAction(payload));

      console.log("res--> 86", res);

      if (res.payload.status) {
        setRoomID("roomId", item.id);
        console.log("item", item);
        setRoomData("roomData", item);

        router.replace(PATH_DASHBOARD.home);

        // setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoading(false);
        console.log("res--> 133");

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const logOut = async () => {
    removeData("user");
    router.replace(PATH_AUTH.login);
  };

  // console.log("isLoader", isLoader);
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen bg-black06">
          <button className="btn-logout" onClick={logOut}>
            Log out
          </button>

          <p className="bold-txt-room">CHOOSE A ROOM.</p>
          <div className="room-carousel  ">
            <Carousel
              responsive={responsive}
              itemClass="carousel-item-padding-40-px"
              containerClass="ml-4 mt-4"
              showDots={false}
              renderDotsOutside={true}
            >
              {tournamentData.map((item) => {
                return (
                  <button onClick={selectRoomApi(item)}>
                    <Image
                      src={item.image}
                      layout="fill"
                      className="rounded-3xl"
                    ></Image>

                    {/* <img
                      className="h-148 w-124 mt-6"
                      src={item.image}
                      alt="Sender's Profile Picture"
                    /> */}
                  </button>
                );
              })}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseRoom;
