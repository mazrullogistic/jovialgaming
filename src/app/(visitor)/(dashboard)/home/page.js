"use client";

import SideMenu from "@/components/SideMenu";
import { RHFTextInput } from "@/components/hook-form";
import {
  CommonConstant,
  TOAST_ALERTS,
  TOAST_TYPES,
} from "@/constants/keywords";
import {
  getAvailableMatchesAction,
  getBadgeAction,
  getBadgesAction,
  getConsoleAction,
  getCurrentMatchesAction,
  getGameWinLossAction,
  getMyTournamentAction,
  getNewsAction,
  getProfileCardAction,
  getRecentEarnerAction,
  getSeasonListAction,
  getTournamentListAction,
} from "@/redux/dashboard/action";
import { getData, getRoomId, setConsoleData } from "@/utils/storage";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";

const HomePage = ({ Component, pageProps }) => {
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [tournamentListData, setTournamentListData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [badgeData, setBadgeData] = useState([]);
  const [availableData, setAvailableData] = useState([]);
  const [currentMatchData, setCurrentMatchData] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [consoleList, setConsoleList] = useState([]);
  const [earnerList, setEarnerList] = useState([]);
  const [dropDownSelection, setDropDownSelection] = useState("Available");
  const { toaster } = useToaster();
  const dispatch = useDispatch();
  const router = useRouter();
  // const user = getData("user");
  const [SeasonId, setSeasonId] = useState();
  const [profileData, setProfileData] = useState([]);
  const [isProfileCardModel, setIsProfileCard] = useState(false);
  const [seasonList, setSeasonList] = useState([]);
  const [clickUserId, setClickUserId] = useState("");
  const [gameWinLoss, setGameWinLoss] = useState([]);

  const games = [
    { name: "Warzone 2", score: "19 - 8" },
    { name: "Super Smash Bros", score: "0 - 0" },
    { name: "Mortal Kombat 1", score: "0 - 0" },
    { name: "NBA 2k24", score: "0 - 0" },
    { name: "FC24", score: "0 - 0" },
    { name: "Mario Kart", score: "0 - 0" },
    { name: "Demon Slayer", score: "0 - 0" },
    { name: "Modern Warfare", score: "0 - 0" },
    { name: "NFL Madden 24", score: "0 - 0" },
    { name: "Overwatch 2", score: "0 - 0" },
    { name: "Valorant", score: "0 - 0" },
    { name: "Street Fighter 6", score: "0 - 0" },
  ];
  const [matchesDropDown, setMatchesDropDown] = useState([
    { name: "Available" },
    { name: "My Matches" },
    { name: "My Tournaments" },
  ]);
  const [selectedEarner, setSelectedEarner] = useState(null); // State for the selected earner
  const [scoreBoardModel, setScoreBoardModel] = useState(false); // State for the selected earner
  const [bcModel, setBcModel] = useState(false); // State for the selected earner
  const [twModel, setTwModel] = useState(false); // State for the selected earner
  const [seasonModel, setSeasonModel] = useState(false); // State for the selected earner

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Only run this on the client side
    const storedUser = getData("user");
    setUser(storedUser);
  }, []);
  useEffect(() => {
    getAvailableMatches();
    getCurrentMatches();
    getMyTournament();
    getTournamentList();
    getNewsList();
    getBadgeNewsList();
    getConsoleList();
    getEarnerList();
    getSeasonList();
    // return () => {};
  }, []);

  const getAvailableMatches = async () => {
    setIsLoader(true);
    try {
      const roomId = getRoomId("roomId");

      const payload = new FormData();
      const res = await dispatch(getAvailableMatchesAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setAvailableData(res.payload.data);

        // setRoomID("roomId", "");
        setIsLoader(false);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        console.log("res--> 133");

        // toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      //   toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getCurrentMatches = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getCurrentMatchesAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setCurrentMatchData(res.payload.data);
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
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
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getMyTournament = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getMyTournamentAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setMyTournaments(res.payload.data);
        // setRoomID("roomId", "");
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getTournamentList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getTournamentListAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setTournamentListData(res.payload.data);
        // setRoomID("roomId", "");
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getNewsList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getNewsAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setNewsData(res.payload.data);
        // setRoomID("roomId", "");
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getBadgeNewsList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getBadgeAction());

      console.log("res--> 96", res);

      if (res.payload.statusCode == 200) {
        setBadgeData(res.payload.data);
        setIsLoader(false);
        // setIsLoading(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
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

      console.log("res--> 2451", res);

      if (res.payload.statusCode == 200) {
        setConsoleData("consoleData", res.payload.data[0]);
        setConsoleList(res.payload.data);
        // setIsLoader(false);
        // setIsLoading(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getProfileCard = async (SeasonId, Uid) => {
    setIsLoader(true);
    console.log("SeasonId 311", SeasonId);
    const object = {
      id: Uid,
      seasonId: SeasonId,
    };
    console.log("object 314", object);
    try {
      const res = await dispatch(getProfileCardAction(object));

      console.log("res--> 318", res.payload.data);

      if (res.payload.status) {
        setProfileData(res.payload.data.data);
        setIsProfileCard(true);

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getUserBadgeList = async () => {
    setIsLoader(true);
    console.log("SeasonId 311", SeasonId);
    const object = {
      user_id: clickUserId,
      seasonId: SeasonId,
    };

    console.log("object 314", object);
    try {
      const res = await dispatch(getBadgesAction(object));

      console.log("res--> 371", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getGameWinLoss = async () => {
    setIsLoader(true);
    console.log("SeasonId 360", SeasonId);
    const object = {
      id: clickUserId,
      seasonId: SeasonId,
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
        setScoreBoardModel(true);

        setScoreBoardModel(true);

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getTourGameWinLoss = async () => {
    setIsLoader(true);
    console.log("SeasonId 360", SeasonId);
    const object = {
      id: clickUserId,
      seasonId: SeasonId,
      status: 1,
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
        setScoreBoardModel(true);

        setScoreBoardModel(true);

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };
  const getEarnerList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getRecentEarnerAction());

      console.log("res--> 241", res);

      if (res.payload.statusCode == 200) {
        setEarnerList(res.payload.data);
        // setIsLoader(false);
        // setIsLoading(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        console.log("res--> 133");
        setIsLoader(false);

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  const handleEarnerClick = (earner) => {
    console.log("earner 367", earner);
    setClickUserId(earner.userData.id);
    setSelectedEarner(earner); // Set selected earner data
    console.log("SeasonId 371", SeasonId);
    getProfileCard(SeasonId, earner.userData.id);
  };

  const closeModal = () => {
    setSelectedEarner(null); // Close modal
  };
  const handleChange = (event) => {
    const { value } = event.target;
    console.log("stateCode", value);
    setDropDownSelection(value);
  };
  const handleChangeConsole = (event) => {
    const selectedOption = JSON.parse(event.target.value);
    console.log("selectedOption", selectedOption);
    setConsoleData("consoleData", selectedOption);
  };
  // setScoreBoardModel(true);

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
            setIsProfileCard(true);
          }}
        >
          close
        </button>
      </div>
    );
  }
  function BCBoard() {
    console.log("gameWinLoss", gameWinLoss);
    return (
      <div className="flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[25%]">
        <span className="text-[22px]  font-[400] pl-4">{"Badges"}</span>

        <div className="bg-black p-4 rounded-lg shadow-lg  ">
          <ul className="list-none space-y-2">
            {gameWinLoss.map((game, index) => (
              <button key={index} className="flex justify-between">
                <span>{"djkdj"}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setBcModel(false);
            setIsProfileCard(true);
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
            {gameWinLoss.map((game, index) => (
              <button key={index} className="flex justify-between">
                <span>{"djkdj"}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center"
          onClick={() => {
            setTwModel(false);
            setIsProfileCard(true);
          }}
        >
          close
        </button>
      </div>
    );
  }
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
                  setIsProfileCard(true);
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
            setIsProfileCard(true);
          }}
        >
          close
        </button>
      </div>
    );
  }
  function ProfileCard({ item, onClose }) {
    return (
      <div className="bg-black26 text-white rounded-lg shadow-lg p-6 w-96 mx-auto">
        <div className="flex">
          <button
            className="text-white text-xl mb-4 w-[100%] flex items-center"
            onClick={() => {
              console.log("item 497", selectedEarner);
              setIsProfileCard(false);
              setSeasonModel(true);
            }}
          >
            Profile Card
            <i className="fas fa-chevron-down ml-2">
              <Image src="/images/dropdown.png" width={15} height={15} />
            </i>
            {/* Add this for the down arrow */}
          </button>
          <button className="text-xl mb-4 text-gray-400" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Profile Image */}
            <img
              src={profileData?.image}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray82"
            />
            <div>
              <h2 className="text-xl font-bold">{profileData?.username}</h2>
              <div className="flex space-x-6 text-white mt-1">
                <button
                  className="flex items-center"
                  onClick={() => {
                    console.log("item 497", selectedEarner);
                    setIsProfileCard(false);
                    getGameWinLoss();
                  }}
                >
                  <div>
                    <p className="text-sm mb-1">W/L</p>
                    <p className="font-semibold">
                      {profileData?.win}-{profileData?.loss}
                    </p>
                  </div>
                  <i className="fas fa-chevron-down ml-2 mt-2">
                    <Image
                      src="/images/dropdown.png"
                      width={15}
                      height={15}
                      alt="dropdown"
                    />
                  </i>
                </button>

                <button
                  className="flex items-center"
                  onClick={() => {
                    console.log("item 497", selectedEarner);
                    setIsProfileCard(false);
                    setBcModel(true);
                    getUserBadgeList();
                  }}
                >
                  <div>
                    <p className="text-sm mb-1">BC</p>
                    <p className="font-semibold">{profileData?.badgeCount}</p>
                  </div>
                  <i className="fas fa-chevron-down ml-2 mt-2">
                    <Image
                      src="/images/dropdown.png"
                      width={15}
                      height={15}
                      alt="dropdown"
                    />
                  </i>
                </button>

                <button
                  className="flex items-center"
                  onClick={() => {
                    console.log("item 497", selectedEarner);
                    setIsProfileCard(false);
                    setTwModel(true);
                    getTourGameWinLoss();
                  }}
                >
                  <div>
                    <p className="text-sm mb-1">TW</p>
                    <p className="font-semibold">
                      {profileData?.tournamentWin}
                    </p>
                  </div>
                  <i className="fas fa-chevron-down ml-2 mt-2">
                    <Image
                      src="/images/dropdown.png"
                      width={15}
                      height={15}
                      alt="dropdown"
                    />
                  </i>
                </button>
              </div>
            </div>
          </div>
          {/* Close button */}
        </div>

        {/* Challenge Button */}
        <div className="mt-4 flex items-center space-x-4">
          <button className="bg-yellow hover:bg-yellow text-black06   py-2 px-4 rounded">
            + Challenge
          </button>
        </div>
        {/* recentMatches */}
        {/* Recent Matches */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Recents</h3>
          <ul className="mt-2">
            {profileData?.recentMatches.map((item) => {
              return (
                <li
                  className={`flex mt-2 ${
                    item.winLossStatus === 0 || item.winLossStatus === 2
                      ? "text-red"
                      : "text-green"
                  }`}
                >
                  {item.winLossStatus === 0 || item.winLossStatus === 2
                    ? "L"
                    : "W"}

                  <li className="text-white ml-4">{item.userString}</li>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="flex bg-black06  ">
          <div className=" w-[100%] bg-black06">
            <p className="header-home-txt">Welcome {user?.data?.username} ,</p>
            <img
              src={user?.roomDetails?.image}
              className="w-[90%] h-[18%] ml-4 rounded-xl mt-2"
            />
            <div className="flex mt-4">
              <select
                className="w-24 bg-black25 text-white text-[12px]  text-center   rounded-3xl ml-4 mt-2 h-8 pr-2"
                onChange={handleChangeConsole}
              >
                {consoleList.map((option, index) => (
                  <option key={index} value={JSON.stringify(option)}>
                    {option.consolename}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  router.push(PATH_DASHBOARD.chat);
                }}
                className="w-20 bg-black25 text-white text-[12px]  text-center   rounded-3xl ml-4 mt-2 h-8 "
              >
                Chat
              </button>
              <div className="w-20 bg-black25 text-white text-[12px]  text-center pt-[0.5%] rounded-3xl ml-4 mt-2 h-8 ">
                <a
                  target="_blank"
                  href="https://discord.gg/CtVr3pAnqs"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </div>
            </div>
            <div>
              <select className="dropdown-available " onChange={handleChange}>
                {matchesDropDown.map((option) => (
                  <option>{option.name}</option>
                ))}
              </select>
            </div>

            {dropDownSelection == "Available" && (
              <div>
                {availableData.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass="carousel-item-padding-40-px"
                    containerClass="ml-4 mt-4"
                  >
                    {availableData.map((post) => {
                      return (
                        <div className="  w-64   mt-6   bg-black25 rounded-2xl pt-[1px]">
                          <div className="mt-[5%]">
                            <div className="flex">
                              <Image
                                src={post.game_image}
                                className="h-[40px] w-[40px] rounded-full  ml-4"
                                width={40}
                                height={40}
                              />
                              <p className="avl-txt">{post.amount}</p>
                            </div>
                            <p className="avl-txt">{post.gamename}</p>

                            <p className="avl-txt">{post.gameModeName}</p>
                            <div className="center-container">
                              <button
                                className="btn-join"
                                onClick={() => {
                                  console.log("item", post);
                                  CommonConstant.SelectedMatchData = post;
                                  router.push(PATH_DASHBOARD.createGame);
                                }}
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className="avl-txt">No data Found</p>
                )}
              </div>
            )}

            {dropDownSelection == "My Matches" && (
              <div>
                {currentMatchData.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass="carousel-item-padding-40-px"
                    containerClass="ml-4 mt-4"
                  >
                    {currentMatchData.map((item) => {
                      return (
                        <div className="  w-64   mt-6   bg-black25 rounded-2xl pt-[1px]">
                          <div className="mt-[5%]">
                            <div className="flex">
                              <Image
                                src={item.game_image}
                                className="h-[40px] w-[40px] rounded-full  ml-4"
                                width={40}
                                height={40}
                              />
                              <p className="avl-txt">{item.amount}</p>
                            </div>
                            <p className="avl-txt">{item.gamename}</p>

                            <p className="avl-txt">{item.gameModeName}</p>
                            <div className="center-container">
                              <button
                                className="btn-join"
                                onClick={() => {
                                  console.log("item", item);
                                  CommonConstant.SelectedMatchData = item;
                                  router.push(PATH_DASHBOARD.createGame);
                                }}
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className="avl-txt">No data Found</p>
                )}
              </div>
            )}

            {dropDownSelection == "My Tournaments" && (
              <div>
                {myTournaments.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass="carousel-item-padding-40-px"
                    containerClass="ml-4 mt-4"
                  >
                    {myTournaments.map((post) => {
                      return (
                        <div className="  w-64   mt-6   bg-black25 rounded-2xl pt-[1px]">
                          <div className="mt-[5%]">
                            <Image
                              src={post.game_image}
                              className="h-[40px] w-[40px] rounded-full  ml-4"
                              width={40}
                              height={40}
                            />
                            <p className="avl-txt">{post.gamename}</p>

                            <p className="avl-txt">{post.gameModeName}</p>
                            <div className="center-container">
                              <button
                                className="btn-join"
                                onClick={() => {
                                  console.log("post", post);
                                }}
                              >
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className="avl-txt">No data Found</p>
                )}
              </div>
            )}
            <p className="bold-txt">Recent Earners</p>
            <Carousel
              responsive={responsive}
              itemClass="carousel-item-padding-40-px"
              containerClass="ml-4 mt-4"
            >
              {earnerList.map((item) => {
                console.log("====================================");
                console.log("post", item.userData.image);
                console.log("====================================");
                return (
                  <div
                    className="w-56  h-52mt-6 bg-black25 rounded-2xl pt-[1px] border border-white flex items-center justify-center"
                    onClick={() => handleEarnerClick(item)} // Open modal on click
                  >
                    <div className="text-center mt-4">
                      <Image
                        src={
                          item.userData.image
                            ? item.userData.image
                            : "/images/logo.png"
                        }
                        className="h-[40px] w-[40px] rounded-xl mx-auto "
                        width={40}
                        height={40}
                      />
                      <p className="earn-txt">{item.userData.username}</p>
                      <p className="earn-txt mb-6">{"$" + item.amount}</p>
                    </div>
                  </div>
                );
              })}
            </Carousel>
            {/* Profile Card Modal */}
            {selectedEarner && (
              /* {true && ( */
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {isProfileCardModel && (
                  <ProfileCard
                    earner={selectedEarner}
                    onClose={closeModal} // Pass function to close the modal
                  />
                )}
                {scoreBoardModel && <ScoreBoard />}
                {twModel && <TWBoard />}
                {bcModel && <BCBoard />}
                {seasonModel && <SeasonModel />}
              </div>
            )}
            {/* <p className="bold-txt">Tournaments</p> */}
            {/* <Carousel
              responsive={responsive}
              itemClass="carousel-item-padding-40-px"
              containerClass="ml-4 mt-4"
            >
              {tournamentListData.map((post) => {
                return (
                  <div className="h-48 w-24 mt-6">
                    <Image
                      src={post.image}
                      layout="fill"
                      className="rounded-3xl"
                    ></Image>
                  </div>
                );
              })}
            </Carousel> */}

            <p className="bold-txt">Jovial News</p>
            <Carousel
              responsive={responsive}
              itemClass="carousel-item-padding-40-px"
              containerClass="ml-4 mt-4"
            >
              {newsData.map((post) => {
                return (
                  <div className="h-48 w-24 mt-6">
                    <Image
                      // src={post.newsImg}
                      src={
                        "https://admin.jovialgaming.com/backend/uploads/newsImg/ad29da13-efc1-461e-a74e-47b628484927.png"
                      }
                      layout="fill"
                      className="rounded-3xl"
                    ></Image>
                  </div>
                );
              })}
            </Carousel>
            <p className="bold-txt">Elite 5 </p>
            <Carousel
              responsive={responsive}
              itemClass="carousel-item-padding-40-px"
              className="flex flex-row  mt-2 "
            >
              {badgeData.map((post) => {
                return (
                  <div className="h-28 w-28   mt-6  relative ml-6 ">
                    <Image src={post.image} layout="fill"></Image>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
