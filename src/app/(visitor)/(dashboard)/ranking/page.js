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

const Ranking = () => {
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
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="bg-black26 h-full">
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black06 bg-opacity-50">
              <div className="bg-black26 text-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Select Game</h2>

                {/* Single select dropdown */}
                <select
                  className="border border-gray6E text-black26 rounded px-4 py-2 w-full mb-4"
                  onChange={handleSelectChange}
                  value={selectedOption}
                >
                  <option value="">Select Game</option>

                  {tournamentData.map((option) => (
                    <option key={option.id} value={option.gamename}>
                      {option.gamename}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={toggleModal}
                    className="bg-gray6E text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-gray6E text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="container mx-auto p-4 bg-black06 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl mt-6 font-semibold mb-2 text-white ml-8">
                Ranking
              </h2>
              <button onClick={toggleModal} className="mr-8">
                {/* Add your filter icon here */}
                <img
                  src="/images/filter.svg"
                  alt="Filter"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* Check if badgesData has items */}
            {badgesData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {badgesData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black25 text-white p-6 rounded-lg shadow-lg border border-gray-200 mr-4 ml-8 mt-8"
                  >
                    <img
                      src={item.image}
                      className="w-full h-48 object-cover mb-4 rounded-lg"
                    />
                    <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                    <p className="text-gray-600">{user.data.username}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-3xl text-center mt-8">
                No data found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Ranking;
