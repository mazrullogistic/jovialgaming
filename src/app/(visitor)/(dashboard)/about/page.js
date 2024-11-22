"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  getBadgesAction,
  getBadgesDataAction,
  getRoomList,
  getSearchBadgesAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData, setDisputeData } from "@/utils/storage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";

const About = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const router = useRouter();
  const user = getData("user");
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBadgedData, setSelectedBadgedData] = useState("");

  const items = [
    { id: 1, title: "Item 1", description: "Description for item 1" },
    { id: 2, title: "Item 2", description: "Description for item 2" },
    { id: 3, title: "Item 3", description: "Description for item 3" },
    { id: 4, title: "Item 4", description: "Description for item 4" },
    { id: 5, title: "Item 5", description: "Description for item 5" },
    { id: 6, title: "Item 6", description: "Description for item 6" },
    { id: 1, title: "Item 1", description: "Description for item 1" },
    { id: 2, title: "Item 2", description: "Description for item 2" },
    { id: 3, title: "Item 3", description: "Description for item 3" },
    { id: 4, title: "Item 4", description: "Description for item 4" },
    { id: 5, title: "Item 5", description: "Description for item 5" },
    { id: 6, title: "Item 6", description: "Description for item 6" },
    { id: 1, title: "Item 1", description: "Description for item 1" },
    { id: 2, title: "Item 2", description: "Description for item 2" },
    { id: 3, title: "Item 3", description: "Description for item 3" },
    { id: 4, title: "Item 4", description: "Description for item 4" },
    { id: 5, title: "Item 5", description: "Description for item 5" },
    { id: 6, title: "Item 6", description: "Description for item 6" },
  ];
  const [badgesData, setBadgesData] = useState([]);

  useEffect(() => {
    getUserBadgeList();
    getGameListApi();
  }, []);
  const getUserBadgeList = async () => {
    setIsLoader(true);
    const object = {
      user_id: user.data.id,
    };

    try {
      const res = await dispatch(getBadgesDataAction(object));

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setBadgesData(res.payload.data.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getSearchBadge = async () => {
    setIsLoader(true);
    const object = {
      game: selectedBadgedData.id,
      user_id: user.data.id,
    };

    const paramObj = new FormData();
    paramObj.append("game", selectedBadgedData.id);

    paramObj.append("user_id", user.data.id);
    try {
      const res = await dispatch(getSearchBadgesAction(paramObj));

      if (res.payload.status) {
        setBadgesData(res.payload.data.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getGameListApi = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getRoomList());

      if (res.payload.statusCode == 200) {
        setIsLoader(false);
        setTournamentData(res.payload.data);
      } else {
        setIsLoading(false);

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getDisputesList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(disputesListAction());

      setIsLoader(false);

      if (res.payload.status) {
        setDisputeList(res.payload.data.data);
        //setChatData([...res.payload.data.data].reverse());
      } else {
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.selectedIndex;
    const index = selectedIndex - 1;

    setSelectedBadgedData(tournamentData[index]);
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    // Add submit logic here
    getSearchBadge();
    //alert(`Selected option: ${selectedOption}`);
    toggleModal();
  };
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="bg-black06 min-h-screen text-white">
          {/* Header */}
          <header className="flex items-center justify-between p-4 ml-8">
            <h1 className="text-3xl font-semibold">About</h1>
            <div></div> {/* Placeholder for centering the title */}
          </header>

          {/* List items */}
          <ul className="text-[16px] sm:text-[22px] flex flex-col items-center m-8 sm:m-52">
            <li className="p-2 sm:p-4 w-full text-center">
              <a
                href="https://admin.jovialgaming.com/terms-of-service"
                className="block text-white hover:underline"
              >
                Terms of Use
              </a>
            </li>
            <li className="text-[16px] sm:text-[22px] p-2 sm:p-4 w-full text-center">
              <a
                href="https://admin.jovialgaming.com/privacy-policy"
                className="block text-white hover:underline"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default About;
