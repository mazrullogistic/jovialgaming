"use client";

import SideMenu from "@/components/SideMenu";
import { RHFTextInput } from "@/components/hook-form";
import {
  CommonConstant,
  EmitterKey,
  SocketKEY,
  TOAST_ALERTS,
  TOAST_TYPES,
} from "@/constants/keywords";
import {
  addDeviceTokenAction,
  getAvailableMatchesAction,
  getBadgeAction,
  getBadgesAction,
  getBadgesDataAction,
  getConsoleAction,
  getCurrentMatchesAction,
  getGameWinLossAction,
  getMyTournamentAction,
  getNewsAction,
  getProfileCardAction,
  getRecentEarnerAction,
  getSeasonListAction,
  getTop5UsersAction,
  getTournamentListAction,
} from "@/redux/dashboard/action";
import {
  getData,
  getRoomId,
  setConsoleData,
  setCreate,
  setTournamentId,
  getConsoleData
} from "@/utils/storage";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useToaster from "@/hooks/useToaster";
import { useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { messaging, getToken } from "../../../../../public/firebase-config";
import { PATH_DASHBOARD } from "@/routes/paths";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import EventEmitter from "@/components/EventEmitter";
import socket from "@/socket/socket";
// import AvailableMatchAdsHorizontal from "@/components/Ads/adsense/home/AvailableMatchAdsHorizontal";
// import HomeAdsHorizontal from "@/components/Ads/adsense/home/HomeAdsHorizontal";
// import MyMatchesAdsHorizontal from "@/components/Ads/adsense/home/MyMatchesAdsHorizontal";
// import MyTournamentsAdsHorizontal from "@/components/Ads/adsense/home/MyTournamentsAdsHorizontal";

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
  const pathname= usePathname();
  // const user = getData("user");
  const [SeasonId, setSeasonId] = useState();
  const [profileData, setProfileData] = useState([]);
  const [isProfileCardModel, setIsProfileCard] = useState(false);
  const [seasonList, setSeasonList] = useState([]);
  const [clickUserId, setClickUserId] = useState("");
  const [gameWinLoss, setGameWinLoss] = useState([]);
  const [top5users, setTop5users] = useState([]);

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
      breakpoint: { max: 3000, min: 2000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 2000, min: 1024 },
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
  const responsiveNew = {
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

  const handleShowNotification = (payload) => {
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/images/logo.png",
      });
    }
  };
  const [isMobile, setIsMobile] = useState(false);
  // useEffect(() => {
  //   connectSock();
  // }, []);

  // async function connectSock() {
  //   console.log("SocketKEY.socketConnect", SocketKEY.socketConnect);
  //   if (SocketKEY.socketConnect === null) {
  //     socket.start();
  //     socket.subscribeUser();
  //   }
  // }
  useEffect(() => {
    // Function to check if the screen is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as per your design
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.V_API_KEY,
        });
        // console.log("token", token);
        if (token) {
          updateDeviceToken(token);

          // You can now send this token to your server to subscribe for notifications
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    try {
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          // console.log("payload.notification", payload.notification);
          handleShowNotification(payload); // Pass payload here
        }
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      // Register the service worker if 'serviceWorker' is available in the navigator
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {})
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    }
  }, []);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Only run this on the client side
    const storedUser = getData("user");

    setUser(storedUser);
  }, []);


  useEffect(()=>{
    getCurrentMatches();
  },[pathname])

  useEffect(() => {

    EventEmitter.on(EmitterKey.FoundMatch, (response) => {
    //  console.log("🚀 ~ EventEmitter.on ~ response:", response)
     getCurrentMatches();
    })

    EventEmitter.on(EmitterKey.DeclineMatch, (message) => {
      getCurrentMatches();
    });

    getAvailableMatches();
    getCurrentMatches();
    getMyTournament();
    getTournamentList();
    getNewsList();
    getBadgeNewsList();
    getConsoleList();
    getTop5UsersList();
    getEarnerList();
    getSeasonList();
  }, []);

  const updateDeviceToken = async (token) => {
    setIsLoader(true);
    const payload = new FormData();
    // console.log("payload", payload);

    try {
      payload.append("devicetype", "web");
      payload.append("devicetoken", token);

      const res = await dispatch(addDeviceTokenAction(payload));
      // console.log("res", res);
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const getAvailableMatches = async () => {
    setIsLoader(true);
    try {
      const roomId = getRoomId("roomId");

      const payload = new FormData();
      const res = await dispatch(getAvailableMatchesAction());

      if (res.payload.statusCode == 200) {
        setAvailableData(res.payload.data);

        setIsLoader(false);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  const getCurrentMatches = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getCurrentMatchesAction());
      if (res.payload.statusCode == 200) {
        setCurrentMatchData(res.payload.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getSeasonList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getSeasonListAction());

      if (res.payload.status) {
        setSeasonList(res.payload.data.data);
        setSeasonId(res.payload.data.data[0].id);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getMyTournament = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getMyTournamentAction());

      if (res.payload.statusCode == 200) {
        setMyTournaments(res.payload.data);
        // setRoomID("roomId", "");
        setIsLoader(false);
        //toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getTournamentList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getTournamentListAction());
      if (res.payload.statusCode == 200) {
        setTournamentListData(res.payload.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getNewsList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getNewsAction());

      if (res.payload.statusCode == 200) {
        setNewsData(res.payload.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getBadgeNewsList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getBadgeAction());

      if (res.payload.statusCode == 200) {
        setBadgeData(res.payload.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
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

      if (res.payload.statusCode == 200) {
        const selectedData=getConsoleData("consoleData")
        if(!selectedData){
           setConsoleData("consoleData", res.payload.data[0]);
        }
        const data=res?.payload?.data?.map((i)=> (i?.id === selectedData?.id ? {...i, isSelected:true}: {...i, isSelected:false}))
        setConsoleList(data);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
        console.log('error', error)
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getTop5UsersList = async () => {
    setIsLoader(true);
    const roomId = getRoomId("roomId");

    const object = {
      roomId: roomId,
    };

    try {
      const res = await dispatch(getTop5UsersAction(object));

      if (res.payload.status) {
        setTop5users(res.payload.data.data);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getProfileCard = async (SeasonId, Uid) => {
    setIsLoader(true);
    const object = {
      id: Uid,
      seasonId: SeasonId,
    };
    try {
      const res = await dispatch(getProfileCardAction(object));

      if (res.payload.status) {
        setProfileData(res.payload.data.data);
        setIsProfileCard(true);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getUserBadgeList = async () => {
    setIsLoader(true);
    const object = {
      user_id: clickUserId,
    };

    try {
      const res = await dispatch(getBadgesDataAction(object));

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setGameWinLoss(res.payload.data.data);

        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getGameWinLoss = async () => {
    setIsLoader(true);
    const object = {
      id: clickUserId,
      seasonId: SeasonId,
      status: 0,
    };

    try {
      const res = await dispatch(getGameWinLossAction(object));
      if (res.payload.status) {
        setGameWinLoss(res.payload.data.data);
        setScoreBoardModel(true);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getTourGameWinLoss = async () => {
    setIsLoader(true);
    const object = {
      id: clickUserId,
      seasonId: SeasonId,
      status: 1,
    };

    try {
      const res = await dispatch(getGameWinLossAction(object));
      if (res.payload.status) {
        setGameWinLoss(res.payload.data.data);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const getEarnerList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getRecentEarnerAction());

      if (res.payload.statusCode == 200) {
        setEarnerList(res.payload.data);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };

  const handleEarnerClick = (earner) => {
    setClickUserId(earner.userData.id);
    setSelectedEarner(earner); // Set selected earner data
    getProfileCard(SeasonId, earner.userData.id);
  };

  const closeModal = () => {
    setSelectedEarner(null); // Close modal
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setDropDownSelection(value);
  };
  const handleChangeConsole = (event) => {
    const selectedOption = JSON.parse(event.target.value);
    setConsoleData("consoleData", selectedOption);
  };
  // setScoreBoardModel(true);

  function ScoreBoard() {
    return (
      <div className='flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[80%] md:w-[50%]'>
        <div className='bg-black p-4 rounded-lg shadow-lg  '>
          <ul className='list-none space-y-2'>
            {gameWinLoss.map((game, index) => (
              <button key={index} className='flex justify-between w-[95%]'>
                <span>{game.gamename}</span>
                <span>
                  {game.win} - {game.loss}
                </span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className='mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center'
          onClick={() => {
            setScoreBoardModel(false);
            setIsProfileCard(true);
          }}>
          close
        </button>
      </div>
    );
  }
  function BCBoard() {
    return (
      <div className='flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[85%] md:w-[25%]'>
        <span className='text-[22px]  font-[400] pl-4'>{"Badges"}</span>

        <div className='bg-black p-4 rounded-lg shadow-lg  '>
          <ul className='list-none space-y-2'>
            {gameWinLoss.map((game, index) => (
              <button key={index} className='flex justify-between'>
                <span>{game.name}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className='mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center'
          onClick={() => {
            setBcModel(false);
            setIsProfileCard(true);
          }}>
          close
        </button>
      </div>
    );
  }
  function TWBoard() {
    return (
      <div className='flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[75%] md:w-[25%]'>
        <span className='text-[22px]  font-[400] pl-4'>
          {"Tournament Wins"}
        </span>

        <div className='bg-black p-4 rounded-lg shadow-lg  '>
          <ul className='list-none space-y-2'>
            {gameWinLoss.map((game, index) => (
              <button key={index} className='flex justify-between'>
                <span>{game.tname}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className='mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center'
          onClick={() => {
            setTwModel(false);
            setIsProfileCard(true);
          }}>
          close
        </button>
      </div>
    );
  }
  function SeasonModel() {
    return (
      <div className='flex flex-col   justify-center   bg-black26 text-white rounded p-4 w-[80%] md:w-[25%]'>
        <span className='text-[22px]  font-[400] pl-4'>{"Season"}</span>

        <div className='bg-black p-4 rounded-lg shadow-lg  '>
          <ul className='list-none space-y-2'>
            {seasonList.map((game, index) => (
              <button
                key={index}
                className='flex justify-between'
                onClick={() => {
                  setSeasonId(game.id);
                  setSeasonModel(false);
                  setIsProfileCard(true);
                }}>
                <span>{game.name}</span>
              </button>
            ))}
          </ul>
        </div>
        <button
          className='mt-4 bg-yellow  hover:bg-yellow text-black26 py-2 px-4 rounded-xl w-[25%]   self-center'
          onClick={() => {
            setSeasonModel(false);
            setIsProfileCard(true);
          }}>
          close
        </button>
      </div>
    );
  }
  function ProfileCard({ item, onClose }) {
    return (
      <div className='bg-black26 text-white rounded-lg shadow-lg p-6 w-96 mx-auto'>
        <div className='flex'>
          <button
            className='text-white text-xl mb-4 w-[100%] flex items-center'
            onClick={() => {
              setIsProfileCard(false);
              setSeasonModel(true);
            }}>
            Profile Card
            <i className='fas fa-chevron-down ml-2'>
              <Image src='/images/dropdown.png' width={15} height={15} />
            </i>
            {/* Add this for the down arrow */}
          </button>
          <button className='text-xl mb-4 text-gray-400' onClick={onClose}>
            ✕
          </button>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            {/* Profile Image */}
            <img
              src={profileData?.image}
              alt='Profile'
              className='w-24 h-24 rounded-full border-2 border-gray82'
            />
            <div>
              <h2 className='text-xl font-bold'>{profileData?.username}</h2>
              <div className='flex space-x-6 text-white mt-1'>
                <button
                  className='flex items-center'
                  onClick={() => {
                    setIsProfileCard(false);
                    getGameWinLoss();
                  }}>
                  <div>
                    <p className='text-sm mb-1'>W/L</p>
                    <p className='font-semibold'>
                      {profileData?.win}-{profileData?.loss}
                    </p>
                  </div>
                  <i className='fas fa-chevron-down ml-2 mt-2'>
                    <Image
                      src='/images/dropdown.png'
                      width={15}
                      height={15}
                      alt='dropdown'
                    />
                  </i>
                </button>

                <button
                  className='flex items-center'
                  onClick={() => {
                    setIsProfileCard(false);
                    setBcModel(true);
                    getUserBadgeList();
                  }}>
                  <div>
                    <p className='text-sm mb-1'>BC</p>
                    <p className='font-semibold'>{profileData?.badgeCount}</p>
                  </div>
                  <i className='fas fa-chevron-down ml-2 mt-2'>
                    <Image
                      src='/images/dropdown.png'
                      width={15}
                      height={15}
                      alt='dropdown'
                    />
                  </i>
                </button>

                <button
                  className='flex items-center'
                  onClick={() => {
                    setIsProfileCard(false);
                    setTwModel(true);
                    getTourGameWinLoss();
                  }}>
                  <div>
                    <p className='text-sm mb-1'>TW</p>
                    <p className='font-semibold'>
                      {profileData?.tournamentWin}
                    </p>
                  </div>
                  <i className='fas fa-chevron-down ml-2 mt-2'>
                    <Image
                      src='/images/dropdown.png'
                      width={15}
                      height={15}
                      alt='dropdown'
                    />
                  </i>
                </button>
              </div>
            </div>
          </div>
          {/* Close button */}
        </div>

        {/* Challenge Button */}
        <div className='mt-4 flex items-center space-x-4'>
          <button
            onClick={() => {
              // console.log("profileData", profileData);
              CommonConstant.challengeData = profileData;
              router.push("./createGame");
              setCreate("create", true);
            }}
            className='bg-yellow hover:bg-yellow text-black06   py-2 px-4 rounded'>
            + Challenge
          </button>
        </div>
        {/* recentMatches */}
        {/* Recent Matches */}
        <div className='mt-6'>
          <h3 className='text-lg font-bold'>Recents</h3>
          <ul className='mt-2'>
            {profileData?.recentMatches.map((item) => {
              return (
                <li
                  className={`flex mt-2 ${
                    item.winLossStatus === 0 || item.winLossStatus === 2
                      ? "text-red"
                      : "text-green"
                  }`}>
                  {item.winLossStatus === 0 || item.winLossStatus === 2
                    ? "L"
                    : "W"}

                  <li className='text-white ml-4'>{item.userString}</li>
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
        <div className='flex bg-black06  '>
          <div className=' w-[100%] bg-black06'>
            <div className='flex items-center justify-between w-full'>
              <p className='header-home-txt'>
                Welcome {user?.data?.username} ,
              </p>
              <button
                className='ml-auto mr-12 hidden md:block'
                onClick={() => {
                  router.push("/createGame");
                  CommonConstant.isModelShow = true;
                  //EventEmitter.emit(EmitterKey.ShowDialog, "");
                }}>
                <Image
                  src='/images/plus.png'
                  className='plus-img'
                  width={30}
                  height={30}
                  alt='Logo'
                />
              </button>
            </div>
            {/* <img
              src={user?.roomDetails?.image}
              // Adjust as needed for your design
              className="w-[60%] h-auto max-h-[380px] ml-4 rounded-xl mt-2   bg-gray30"
              alt="Room Details"
              style={{ objectFit: "fill" }} // Ensures the image is properly cropped to fill
            /> */}

            <Image
              src={user?.roomDetails?.image}
              width={400} // Adjust as needed for your design
              height={300} // Adjust as needed for your design
              className='w-[93%] h-auto max-h-[430px] ml-4 rounded-xl mt-2 object-center bg-gray30'
              // Adjust as needed for your design
              alt='Room Details'
            />

            {isMobile ? (
              <div className='flex flex-row mt-4 gap-4 ml-4'>
                {/* Console Dropdown */}
                <div className='bg-black25 w-full sm:w-20 rounded-3xl h-8 flex items-center justify-center relative'>
                  <select
                    className='bg-black25 text-white text-[12px] text-center rounded-3xl h-full px-2 appearance-none pr-6 w-full sm:w-auto'
                    onChange={handleChangeConsole}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                    }}>
                    {consoleList.map((option, index) => (
                      <option key={index} value={JSON.stringify(option)} selected={option?.isSelected}>
                        {option.consolename}
                      </option>
                    ))}
                  </select>

                  {/* Custom arrow */}
                  <img
                    className='absolute right-4 pointer-events-none'
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "0.6rem",
                      height: "1rem",
                    }}
                    src='/images/arrowDown.svg'
                    alt='Dropdown arrow'
                  />
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => {
                    router.push(PATH_DASHBOARD.chat);
                  }}
                  className='w-full sm:w-20 bg-black25 text-white text-[12px] text-center rounded-3xl h-8'>
                  Chat
                </button>

                {/* Discord Button */}
                <div className='w-full sm:w-20 bg-black25 text-white text-[12px] text-center rounded-3xl h-8 flex items-center justify-center'>
                  <a
                    target='_blank'
                    href='https://discord.gg/CtVr3pAnqs'
                    rel='noopener noreferrer'>
                    Discord
                  </a>
                </div>
              </div>
            ) : (
              <div className='flex mt-4'>
                <div className='bg-black25 w-16 sm:w-20 rounded-3xl h-6 sm:h-8 flex items-center justify-center mt-2 ml-2 sm:ml-4 relative'>
                  <select
                    className='bg-black25 text-white text-[10px] sm:text-[12px] text-center rounded-3xl h-full px-2 appearance-none pr-6' // Add `appearance-none` and padding-right for space
                    onChange={handleChangeConsole}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                    }}>
                    {consoleList.map((option, index) => (
                      <option key={index} value={JSON.stringify(option)} selected={option?.isSelected}>
                        {option.consolename}
                      </option>
                    ))}
                  </select>

                  {/* Custom arrow */}
                  <img
                    className='absolute right-2 pointer-events-none'
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "0.6rem", // Adjust as needed for your design
                      height: "1rem", // Adjust as needed for your design
                    }}
                    src='/images/arrowDown.svg'
                    alt='Dropdown arrow'
                  />
                </div>
                <button
                  onClick={() => {
                    router.push(PATH_DASHBOARD.chat);
                  }}
                  className='w-20 bg-black25 text-white text-[12px]  text-center   rounded-3xl ml-4 mt-2 h-8 '>
                  Chat
                </button>
                <div className='w-full sm:w-20 bg-black25 text-white text-[12px] text-center rounded-3xl h-8 ml-4 mt-2 flex items-center justify-center'>
                  <a
                    target='_blank'
                    href='https://discord.gg/CtVr3pAnqs'
                    rel='noopener noreferrer'>
                    Discord
                  </a>
                </div>
              </div>
            )}


            {/* // Home top ad */}
            {/* <HomeAdsHorizontal /> */}


            <div>
              <select
                className={` text-[22px] mb-2 h-12 text-white bg-black06 ml-6 mt-6 outline-none font-[600] ${
                  dropDownSelection == "Available"
                    ? "w-[150px] md:w-[130px]"
                    : dropDownSelection == "My Matches"
                    ? "w-[180px] md:w-[160px]"
                    : "w-[240px] md:w-[210px]"
                }`}
                onChange={handleChange}>
                {matchesDropDown.map((option) => (
                  <option>{option.name}</option>
                ))}
              </select>
            </div>

            {dropDownSelection == "Available" && (
              <div className='match-small-carousel  '>
                {/* <AvailableMatchAdsHorizontal /> */}
                {availableData.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass='carousel-item-padding-40-px'
                    containerClass='ml-4  '>
                    {availableData.map((post) => {
                      return (
                        <div className='  w-64       bg-black25 rounded-2xl pt-[1px]'>
                          <div className='mt-[5%]'>
                            <div className='flex'>
                              <Image
                                src={post.game_image}
                                className='h-[40px] w-[40px] rounded-full  ml-4'
                                width={40}
                                height={40}
                              />
                              <p className='text-[18px] text-white  font-inter_tight font-[600] ml-14 mt-2  '>
                                {post.amount}
                              </p>
                            </div>
                            <p className='avl-txt'>{post.gamename}</p>

                            <p className='avl-txt'>{post.gameModeName}</p>
                            <div className='center-container'>
                              <button
                                className=' w-[80px] h-[35px]   text-center border-[1px] rounded-full   text-black06 font-inter_tight bg-yellow mb-4 mt-4'
                                onClick={() => {
                                  CommonConstant.SelectedMatchData = post;
                                  // console.log("post 1014", post);
                                  router.push(PATH_DASHBOARD.createGame);
                                }}>
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className='avl-txt'> No Matches Available</p>
                )}
              </div>
            )}

            {dropDownSelection == "My Matches" && (
              <div className='match-small-carousel  '>
                {/* <MyMatchesAdsHorizontal /> */}
                {currentMatchData.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass='carousel-item-padding-40-px'
                    containerClass='ml-4  '>
                    {currentMatchData.map((item) => {
                      return (
                        <div className='  w-64       bg-black25 rounded-2xl pt-[1px]'>
                          <div className='mt-[5%]'>
                            <div className='flex'>
                              <Image
                                src={item.game_image}
                                className='h-[40px] w-[40px] rounded-full  ml-4'
                                width={40}
                                height={40}
                              />
                              <p className='text-[18px] text-white  font-inter_tight font-[600] ml-14 mt-2  '>
                                {item.amount}
                              </p>
                            </div>
                            <p className='avl-txt'>{item.gamename}</p>

                            <p className='avl-txt'>{item.gameModeName}</p>
                            <div className='center-container'>
                              <button
                                className=' w-[80px] h-[35px]   text-center border-[1px] rounded-full   text-black06 font-inter_tight bg-yellow mb-4 mt-4'
                                onClick={() => {
                                  CommonConstant.SelectedMatchData = item;
                                  router.push(PATH_DASHBOARD.createGame);
                                }}>
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className='avl-txt'>No Matches Available</p>
                )}
              </div>
            )}

            {dropDownSelection == "My Tournaments" && (
              <div className='match-small-carousel  '>
                {/* <MyTournamentsAdsHorizontal /> */}
                {myTournaments.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    itemClass='carousel-item-padding-40-px'
                    containerClass='ml-4  '>
                    {myTournaments.map((post) => {
                      return (
                        <div className='  w-64    bg-black25 rounded-2xl pt-[1px]'>
                          <div className='mt-[5%]'>
                            <div className='flex'>
                              <Image
                                src={post.image}
                                className='h-[40px] w-[40px] rounded-full  ml-4'
                                width={40}
                                height={40}
                              />

                              <p className='text-[18px] text-white  font-inter_tight font-[600] ml-14 mt-2  '>
                                {post.tournament_fees}
                              </p>
                            </div>
                            <p className='avl-txt'>{post.tname}</p>

                            <p className='avl-txt'>
                              {moment(post.startdate).format("MMM Do, YYYY")}
                            </p>
                            <div className='center-container'>
                              <button
                                className=' w-[80px] h-[35px]   text-center border-[1px] rounded-full   text-black06 font-inter_tight bg-yellow mb-4 mt-4'
                                onClick={() => {
                                  setTournamentId("id", post);
                                  if (post.status == 2 && post.winnerId != 0) {
                                    toast.error("The tournament is over.");
                                  } else {
                                    if (post.isDisqualified === true) {
                                      toast.error(
                                        "You have been disqualified from this tournament."
                                      );
                                    } else {
                                      router.push("./tournament");
                                    }
                                  }
                                }}>
                                Join
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <p className='avl-txt'>No Tournament Available</p>
                )}
              </div>
            )}
            {/* Hide Recent Earners */}

            {/* <p className="text-[22px] text-white  font-inter_tight font-[600] ml-6 mt-2">
              Recent Earners
            </p>
            <div className="small-carousel ml-6 mt-6">
              <Carousel
                responsive={responsive}
                itemClass="carousel-item-padding-2-px"
              >
                {earnerList.map((item) => {
                  return (
                    <div
                      className="w-56       bg-black25 rounded-2xl pt-[1px] border border-white flex items-center justify-center"
                      onClick={() => handleEarnerClick(item)} // Open modal on click
                    >
                      <div className="text-center mt-4">
                        {item?.userData?.image ? (
                          <img
                            src={
                              item.userData.image
                                ? item.userData.image
                                : "/images/logo.png"
                            }
                            className="h-[40px] w-[40px] rounded-full mx-auto "
                            width={40}
                            height={40}
                          />
                        ) : (
                          <img
                            src={"/images/logo.png"}
                            className="h-[40px] w-[40px] rounded-full mx-auto "
                            width={40}
                            height={40}
                          />
                        )}
                        <p className="earn-txt">{item.userData.username}</p>
                        <p className="earn-txt-green mb-6">
                          {"$" + item.amount}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div> */}
            {/* Profile Card Modal */}
            {selectedEarner && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
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
            <p className='  text-[22px] text-white  font-inter_tight font-[600] ml-6 mb-4'>
              Tournaments
            </p>
            <Carousel
              responsive={responsive}
              itemClass='carousel-item-padding-40-px'
              containerClass='ml-4 mt-6'>
              {tournamentListData.map((item) => {
                return (
                  <div
                    onClick={() => {
                      setTournamentId("id", item);
                      if (item.status == 2 && item.winnerId != 0) {
                        toast.error("The tournament is over.");
                      } else {
                        if (item.isDisqualified === true) {
                          toast.error(
                            "You have been disqualified from this tournament."
                          );
                        } else {
                          router.push("./tournament");
                        }
                      }
                    }}
                    className='h-48 w-24 mt-6'>
                    <Image
                      src={item.image}
                      layout='fill'
                      className='rounded-3xl'></Image>
                  </div>
                );
              })}
            </Carousel>

            <p className='text-[22px] text-white  font-inter_tight font-[600] ml-6 mb-6 mt-6'>
              Jovial News
            </p>
            <Carousel
              responsive={responsive}
              itemClass='carousel-item-padding-40-px'
              containerClass='ml-4 mt-4'>
              {newsData.map((post) => {
                return (
                  <div
                    onClick={() => {
                      window.location.href = post.url; // Redirect to the URL
                    }}
                    className='h-48 w-24 mt-6'>
                    <Image
                      src={post.newsImg}
                      layout='fill'
                      className='rounded-3xl'></Image>
                  </div>
                );
              })}
            </Carousel>
            <p className='text-[22px] text-white  font-inter_tight font-[600] ml-6  mt-6'>
              Elite 5
            </p>
            <div className='elite-small-carousel  '>
              {top5users.length > 0 && (
                <Carousel
                  responsive={responsive}
                  itemClass='carousel-item-padding-40-px'
                  className='flex flex-row  mt-2 '>
                  {top5users.map((post) => {
                    return (
                      <div className='h-28 w-28    mt-2 relative ml-6 rounded-full'>
                        {post?.userData?.image ? (
                          <Image
                            className='rounded-full'
                            src={
                              post.userData.image.startsWith("http") ||
                              post.userData.image.startsWith("/")
                                ? post.userData.image
                                : `/images/logo.png` // Fallback for invalid image paths
                            }
                            layout='fill'></Image>
                        ) : null}
                      </div>
                    );
                  })}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
