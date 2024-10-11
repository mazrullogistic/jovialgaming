"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  getBadgesAction,
  getBadgesDataAction,
  getConsoleAction,
  getGameByConsoleAction,
  getGameWinLossAction,
  getProfileCardAction,
  getProfileDataAction,
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
import {
  getData,
  getRoomId,
  saveData,
  setDisputeData,
  setPaymentData,
} from "@/utils/storage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import {
  CommonConstant,
  TOAST_ALERTS,
  TOAST_TYPES,
} from "@/constants/keywords";
import { ArrowLeft, ChevronDown, Edit2, Plus, Minus } from "lucide-react";
import { updateProfileAction } from "@/redux/Auth/action";
import { upload } from "@/utils/helpers";
import { userData } from "@/redux/Auth/AuthSlice";
const ProfileCard = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const router = useRouter();
  const user = getData("user");
  const [isOpen, setIsOpen] = useState(false);
  const [seasonModel, setSeasonModel] = useState(false); // State for the selected earner
  const [bcModel, setBcModel] = useState(false); // State for the selected earner

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBadgedData, setSelectedBadgedData] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [SeasonId, setSeasonId] = useState();
  const [gameWinLoss, setGameWinLoss] = useState([]);
  const [gameWinTourLoss, setGameTourWinLoss] = useState([]);
  const [gameByConsole, setGameByConsole] = useState([]);
  const [scoreBoardModel, setScoreBoardModel] = useState(false); // State for the selected earner
  const [twModel, setTwModel] = useState(false); // State for the selected earner
  const [fileImg, setFileImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [consoleList, setConsoleList] = useState([]);

  const [badgesData, setBadgesData] = useState([]);

  useEffect(() => {
    getUserBadgeList();
    getGameListApi();
    getSeasonList();
    getConsoleList();
    getTourGameWinLoss();
    getProfile();
  }, []);
  useEffect(() => {
    if (SeasonId) {
    }
  }, [SeasonId]);
  const updateProfileApi = async () => {
    console.log("userInfo", userInfo);
    setIsLoader(true);

    try {
      const payload = new FormData();
      payload.append("id", user.data.id);
      payload.append("username", userInfo.userName);

      payload.append("firstname", userInfo.firstName);
      payload.append("lastname", userInfo.lastName);
      payload.append("email", userInfo.emailAddress);
      payload.append("phone", userInfo.mobileNumber);
      payload.append("psnTag", userInfo.psn);
      payload.append("xboxTag", "");
      payload.append("consoleId", "");
      payload.append("switchTag", "");
      payload.append("console_name", "");
      payload.append("gameId", "");
      payload.append("game_name", userInfo.gamertag);

      const { payload: res } = await dispatch(updateProfileAction(payload));
      console.log("status 137", res);

      const { data, status } = res;
      setIsLoader(false);

      if (status) {
        getSeasonList();
        toast.success(res.message, TOAST_TYPES.ERROR);
        saveData("user", res);
        dispatch(userData(res));
      } else {
      }
    } catch (error) {
      setIsLoader(false);

      console.log("Error", error);
    }
  };
  const getConsoleList = async () => {
    setIsLoader(true);
    const roomId = getRoomId("roomId");

    const object = {
      roomId: roomId,
    };
    try {
      const res = await dispatch(getConsoleAction(object));

      console.log("res--> 108", res);

      if (res.payload.statusCode == 200) {
        // setConsoleData("consoleData", res.payload.data[0]);
        setConsoleList(res.payload.data);
        let indexConsole = 0;

        let param = "";
        const data = res.payload.data;

        param = `${data[indexConsole].id}/0`;
        console.log("param", param);
        getGameByConsole(param);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toast.success(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getTourGameWinLoss = async (id) => {
    setIsLoader(true);
    console.log("SeasonId 360", id);
    const object = {
      id: user.data.id,
      seasonId: id,
      status: 1,
    };
    //  setClickUserId(earner.userData.id);
    //  setSelectedEarner(earner); // Set selected earner data
    //  getProfileCard(SeasonId, earner.userData.id);
    console.log("object 314", object);
    try {
      const res = await dispatch(getGameWinLossAction(object));

      console.log("res--> 110", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        setGameTourWinLoss(res.payload.data.data);

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
  const getGameWinLoss = async (id) => {
    setIsLoader(true);
    console.log("SeasonId 360", user);
    const object = {
      id: user.data.id,
      seasonId: id,
      status: 0,
    };
    //  setClickUserId(earner.userData.id);
    //  setSelectedEarner(earner); // Set selected earner data
    //  getProfileCard(SeasonId, earner.userData.id);
    console.log("object 314", object);
    try {
      const res = await dispatch(getGameWinLossAction(object));

      console.log("res--> 318", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        setGameWinLoss(res.payload.data.data);

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

      console.log("res--> 244", res.payload.data);

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

      console.log("res--> 242", res.payload.data.data);
      console.log("res--> 242", res.payload.data.data[0].id);

      if (res.payload.status) {
        setSeasonList(res.payload.data.data);
        setSeasonId(res.payload.data.data[0].id);
        setIsLoader(false);
        getProfileCard(res.payload.data.data[0].id);
        getGameWinLoss(res.payload.data.data[0].id);
        getTourGameWinLoss(res.payload.data.data[0].id);
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
  const getGameByConsole = async (param) => {
    setIsLoader(true);

    try {
      //const res = await dispatch(getGameByConsoleAction(param));
      const res = await dispatch(getGameByConsoleAction(param));
      setIsLoader(false);

      console.log("res.payload.data 269", res);
      if (res.payload.status) {
        setGameByConsole(res.payload.data);
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
  const getProfile = async () => {
    setIsLoader(true);

    try {
      //const res = await dispatch(getGameByConsoleAction(param));
      const res = await dispatch(getProfileDataAction(user.data.id));
      setIsLoader(false);

      console.log("res.payload.data 269", res);
      if (res.payload.status) {
        CommonConstant.isPaymentDetail = res.payload;
        setPaymentData("payment", res.payload.data);
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
  // Picture Methods

  const updateProfilePicture = async (fileImg) => {
    setIsLoader(true);

    let s3Data = await upload(
      fileImg,
      "userImages",
      fileImg.extension || "",
      fileImg.type || ""
    );

    console.log("s3Data", s3Data);
    console.log("fileImg", fileImg);
    if (!s3Data) {
      toast.error("Uploading failed");
      setIsLoader(false);

      return false;
    }

    const payload = new FormData();
    console.log("user337", user.data);
    payload.append("id", user.data.id);
    payload.append("image", s3Data.Location);
    try {
      // New data to update the object

      const res = await dispatch(updateProfileAction(payload));
      setIsLoader(false);

      if (!res.payload.status) {
        toast.error(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        console.log("first 349", res.payload.data);
        saveData("user", res.payload);
        dispatch(userData(res.payload));

        setIsRefresh();
        toast.success(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setFileImg(file);
    updateProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
  function ScoreBoard() {
    console.log("gameWinLoss", gameWinLoss);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[50%]">
        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {gameWinLoss.map((game, index) => (
              <button key={index} className="flex justify-between w-[95%]">
                <span>{game.gamename}</span>
                <span>
                  {game.win} - {game.loss}
                </span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setScoreBoardModel(false);
            // setIsProfileCard(true);
          }}
        >
          close
        </button>
      </div>
    );
  }
  function BCBoard() {
    console.log("badgesData", badgesData);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%]">
        <span className="text-[22px]  font-[400] pl-4">{"Badges"}</span>

        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {badgesData.map((game, index) => (
              <button key={index} className="flex justify-between">
                <span>{game.name}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setBcModel(false);
            // setIsProfileCard(true);
          }}
        >
          close
        </button>
      </div>
    );
  }
  function TWBoard() {
    console.log("gameWinLoss", gameWinLoss);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%]">
        <span className="text-[22px]  font-[400] pl-4">
          {"Tournament Wins"}
        </span>
        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {gameWinTourLoss.map((game, index) => (
              <button key={index} className="flex justify-between">
                <span>{game.tname}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setTwModel(false);
          }}
        >
          close
        </button>
      </div>
    );
  }

  const [isEditable, setIsEditable] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userName: user.data.username,
    firstName: user.data.firstname,
    lastName: user.data.lastname,
    emailAddress: user.data.email,
    mobileNumber: user.data.phone,
    psn: "",
    gamertag: "",
    switchId: "",
    favoriteGame: "",
  });

  const handleEditClick = () => {
    if (isEditable) {
      console.log("userInfo", userInfo);
      updateProfileApi();
    }
    setIsEditable(!isEditable); // Toggles between edit and view modes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div>
          {scoreBoardModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray82 bg-opacity-75">
              <ScoreBoard />
            </div>
          )}
          {seasonModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray82 bg-opacity-75">
              <SeasonModel />
            </div>
          )}
          {bcModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray82 bg-opacity-75">
              <BCBoard />
            </div>
          )}
          {twModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray82 bg-opacity-75">
              <TWBoard />
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
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={profileImg ? profileImg : profileData?.image}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute bottom-0 right-0 bg-yellow rounded-full p-1 cursor-pointer"
                    >
                      <Edit2 size={16} className="text-gray82" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        name="image"
                        onChange={handleImageChange}
                        id="file-upload"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profileData?.username}
                    </h3>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => {
                          setScoreBoardModel(true);
                        }}
                      >
                        <div>
                          <p className="text-sm">W/L</p>
                          <p className="font-semibold">
                            {profileData?.win}-{profileData?.loss}
                            <ChevronDown size={16} className="inline" />
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setBcModel(true);
                        }}
                      >
                        <div>
                          <p className="text-sm">BC</p>
                          <p className="font-semibold">
                            {profileData?.badgeCount}
                            <ChevronDown size={16} className="inline" />
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTwModel(true);
                        }}
                      >
                        <div>
                          <p className="text-sm">TW</p>
                          <p className="font-semibold">
                            {profileData?.tournamentWin}
                            <ChevronDown size={16} className="inline" />
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => {
                    router.push("/profileCard/addBalance");
                  }}
                  className="flex-1 bg-black26 text-yellow-400 py-2 rounded-lg flex items-center justify-center"
                >
                  <Plus size={20} className="mr-2" /> Add Balance
                </button>
                <button
                  onClick={() => {
                    router.push("/profileCard/withdrawBalance");
                  }}
                  className="flex-1 bg-black26 text-yellow py-2 rounded-lg flex items-center justify-center"
                >
                  <Minus size={20} className="mr-2" /> Withdraw Cash
                </button>
              </div>

              {/* User Information */}
              <div className="bg-black26 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">User Information</h2>
                  <button className="text-yellow-400" onClick={handleEditClick}>
                    {isEditable ? "Save" : "Edit"}
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "User Name", value: "userName" },
                    { label: "First Name", value: "firstName" },
                    { label: "Last Name", value: "lastName" },
                    { label: "Email Address", value: "emailAddress" },
                    { label: "Mobile Number", value: "mobileNumber" },
                    { label: "PSN", value: "psn" },
                    { label: "Gamertag", value: "gamertag" },
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      {isEditable ? (
                        <input
                          type="text"
                          name={item.value}
                          value={userInfo[item.value]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 text-black25 rounded-md"
                        />
                      ) : (
                        <p className="font-semibold">
                          {userInfo[item.value] || "Not provided"}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Switch ID Dropdown */}
                  <div>
                    <p className="text-sm text-gray-400">Favorite Game</p>
                    {isEditable ? (
                      <select
                        name="switchId"
                        value={userInfo.switchId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black25"
                      >
                        <option value="" disabled>
                          Select Favorite Game
                        </option>
                        {console.log("gameByConsole", gameByConsole)}
                        {gameByConsole.data.map((option) => (
                          <option>{option.gamename}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-semibold">
                        {userInfo.switchId || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Favorite Game Dropdown */}
                  <div>
                    <p className="text-sm text-gray-400">Favorite Console</p>
                    {isEditable ? (
                      <select
                        name="favoriteGame"
                        value={userInfo.favoriteGame}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black25"
                      >
                        <option value="" disabled>
                          Select Favorite Console
                        </option>

                        {consoleList.map((option) => (
                          <option>{option.consolename}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-semibold">
                        {userInfo.favoriteGame || "Not provided"}
                      </p>
                    )}
                  </div>
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
