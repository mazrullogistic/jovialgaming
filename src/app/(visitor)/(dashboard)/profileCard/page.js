"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  getBadgesAction,
  getBadgesDataAction,
  getProfileCardAction,
  getRoomList,
  getSearchBadgesAction,
  getSeasonListAction,
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
import { ArrowLeft, ChevronDown, Edit2, Plus, Minus } from "lucide-react";
const ProfileCard = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const router = useRouter();
  const user = getData("user");
  const [isOpen, setIsOpen] = useState(false);
  const [seasonModel, setSeasonModel] = useState(false); // State for the selected earner

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBadgedData, setSelectedBadgedData] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [SeasonId, setSeasonId] = useState();

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
    console.log("user 68", user.data);
    getUserBadgeList();
    getGameListApi();
    getSeasonList();
  }, []);
  const getProfileCard = async (SeasonId) => {
    setIsLoader(true);
    console.log("SeasonId 311", SeasonId);
    const object = {
      id: user.data.id,
      seasonId: SeasonId,
    };
    console.log("object 314", object);
    try {
      const res = await dispatch(getProfileCardAction(object));

      console.log("res--> 318", res.payload.data);

      if (res.payload.status) {
        setProfileData(res.payload.data.data);
        // setIsProfileCard(true);

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const getSeasonList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getSeasonListAction());

      console.log("res--> 152", res.payload.data.data);
      console.log("res--> 152", res.payload.data.data[0].id);

      if (res.payload.status) {
        setSeasonList(res.payload.data.data);
        setSeasonId(res.payload.data.data[0].id);
        setIsLoader(false);
        getProfileCard(res.payload.data.data[0].id);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getUserBadgeList = async () => {
    setIsLoader(true);
    //    console.log("SeasonId 311", SeasonId);
    const object = {
      user_id: user.data.id,
    };

    console.log("object 314", object);
    try {
      const res = await dispatch(getBadgesDataAction(object));

      console.log("res--> 371", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setBadgesData(res.payload.data.data);
        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getSearchBadge = async () => {
    console.log("gameData", selectedBadgedData);
    setIsLoader(true);
    //    console.log("SeasonId 311", SeasonId);
    const object = {
      game: selectedBadgedData.id,
      user_id: user.data.id,
    };

    console.log("object 314", object);

    const paramObj = new FormData();
    paramObj.append("game", selectedBadgedData.id);

    paramObj.append("user_id", user.data.id);
    try {
      const res = await dispatch(getSearchBadgesAction(paramObj));

      console.log("res--> 371", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setBadgesData(res.payload.data.data);
        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getGameListApi = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getRoomList());

      console.log("res-->", res);
      console.log("statusCode-->", res.payload.statusCode);

      if (res.payload.statusCode == 200) {
        setIsLoader(false);
        setTournamentData(res.payload.data);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoading(false);
        console.log("res--> 133");

        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
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
        console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      console.log("Error", error);
    }
  };
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.selectedIndex;
    const index = selectedIndex - 1;
    console.log("index", index);
    console.log("badgesData[index]", tournamentData[index]);
    //  console.log("badgesData[index]", badgesData[index]);
    setSelectedBadgedData(tournamentData[index]);
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    // Add submit logic here
    getSearchBadge();
    //alert(`Selected option: ${selectedOption}`);
    toggleModal();
  };

  function SeasonModel() {
    console.log("seasonList", seasonList);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%]">
        <span className="text-[22px]  font-[400] pl-4">{"Season"}</span>

        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {seasonList.map((game, index) => (
              <button
                key={index}
                className="flex justify-between"
                onClick={() => {
                  setSeasonId(game.id);

                  console.log("ids", game.id);
                  setSeasonModel(false);
                }}
              >
                <span>{game.name}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setSeasonModel(false);
          }}
        >
          close
        </button>
      </div>
    );
  }
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div>
          {seasonModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray82 bg-opacity-75">
              <SeasonModel />
            </div>
          )}

          <div className="min-h-screen bg-black06 text-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
              {/* Back button */}
              <button className="mb-6 p-2 bg-gray6E rounded-lg">
                <ArrowLeft size={24} />
              </button>

              {/* Profile Card */}
              <div className="bg-black26 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => {
                      setSeasonModel(true);
                    }}
                  >
                    <h2 className="text-2xl font-semibold">Profile Card</h2>
                  </button>
                  <button className="text-yellow">Edit</button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={profileData?.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-yellow rounded-full p-1">
                      <Edit2 size={16} className="text-gray82" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profileData?.username}
                    </h3>
                    <div className="flex space-x-4 mt-2">
                      <div>
                        <p className="text-sm">W/L</p>
                        <p className="font-semibold">
                          {profileData?.win}-{profileData?.loss}
                          <ChevronDown size={16} className="inline" />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">BC</p>
                        <p className="font-semibold">
                          {profileData?.badgeCount}
                          <ChevronDown size={16} className="inline" />
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">TW</p>
                        <p className="font-semibold">
                          {profileData?.tournamentWin}
                          <ChevronDown size={16} className="inline" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Buttons */}
              <div className="flex space-x-4 mb-6">
                <button className="flex-1 bg-black26 text-yellow-400 py-2 rounded-lg flex items-center justify-center">
                  <Plus size={20} className="mr-2" /> Add Balance
                </button>
                <button className="flex-1 bg-black26 text-yellow py-2 rounded-lg flex items-center justify-center">
                  <Minus size={20} className="mr-2" /> Withdraw Cash
                </button>
              </div>

              {/* User Information */}
              <div className="bg-black26 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">User Information</h2>
                  <button className="text-yellow-400">Edit</button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "User Name", value: "jayesh" },
                    { label: "First Name", value: "jayesh" },
                    { label: "Last Name", value: "rathod" },
                    {
                      label: "Email Address",
                      value: "jayeshrathod@logisticinfotech.co.in",
                    },
                    { label: "Mobile Number", value: "1234567890" },
                    { label: "PSN", value: "Enter PSN" },
                    { label: "Gamertag", value: "Enter Gamertag" },
                    { label: "Switch ID", value: "Enter Switch ID" },
                    { label: "Favorite Game", value: "" },
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="font-semibold">
                        {item.value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
