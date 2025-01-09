"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  disputesListAction,
  getBadgesAction,
  getBadgesDataAction,
  getBadgeUserListAction,
  getRoomList,
  getSearchBadgesAction,
  getUserPointsAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef, Suspense } from "react";
import moment from "moment";
import { getData, setDisputeData } from "@/utils/storage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import Model from "@/assets/modal/Modal";
import * as THREE from "three";
import textureImage from "../../../../assets/modal/texture.jpg";

const Ranking = () => {
  console.log("Texture", textureImage);
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [isRanking, setIsRanking] = useState(false); // Initialize with null or some default value
  const [isFilter, setIsFilter] = useState(false); // Initialize with null or some default value
  const [isBadgeDialog, setIsBadgeDialog] = useState(false); // Initialize with null or some default value
  const [noDataFoundText, setNoDataFoundText] = useState(""); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const router = useRouter();
  const user = getData("user");
  const [isOpen, setIsOpen] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const [checkboxPinCode, setCheckboxPinCode] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBadgedData, setSelectedBadgedData] = useState("");
  const [filters, setFilters] = useState({
    all: false,
    local: false,
    state: false,
  });
  const [sliderValue, setSliderValue] = useState(0);

  const [badgesData, setBadgesData] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(0);
  const [pointsListData, setPointsData] = useState([]);
  const [userListData, setUserListData] = useState([]);

  const [selectedGlb, setSelectedGlb] = useState(null);
  const [playAnimation, setPlayAnimation] = useState(null);
  const [isOpenedFinished, setIsOpenedFinished] = useState(false);
  const [isClosedFinished, setIsClosedFinished] = useState(true);
  const [isShowOutFinished, setIsShowOutFinished] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [scene, setScene] = useState(null);

  console.log("Badges data", badgesData);

  useEffect(() => {
    const newScene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      textureImage.src,
      (texture) => {
        newScene.background = texture;
        newScene.backgroundIntensity = 0.3; // Only works with certain extensions
        setScene(newScene); // Update the state with the scene
      },
      undefined,
      (err) => console.log("Error loading texture:", err)
    );
  }, []);

  const cameraRef = useRef();

  useEffect(() => {
    if (badgesData && badgesData.length) {
      console.log(currentPlan, "currentPlan");
      updateBadgeState(currentPlan);
    }
  }, [currentPlan]);

  const prevPlan = () => {
    setCurrentPlan((prev) => {
      const newIndex = prev === 0 ? badgesData.length - 1 : prev - 1;
      return newIndex;
    });
  };

  console.log("Loop", badgesData[currentPlan]?.name);

  const nextPlan = () => {
    setCurrentPlan((prev) => {
      const newIndex = prev === badgesData.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  const updateBadgeState = (newIndex) => {
    setSelectedGlb(badgesData[newIndex]?.image);
    setPlayAnimation("idle case");
    setIsOpenedFinished(false);
    setIsClosedFinished(true);
    setIsShowOutFinished(false);
    setIsOpened(false);
  };

  console.log(selectedGlb, "selectedGlb");

  useEffect(() => {
    getUserBadgeList();
    getGameListApi();
  }, []);
  useEffect(() => {
    getUserPoint();
  }, [isFilter]);
  useEffect(() => {
    getUserPoint();
  }, [isRanking]);

  useEffect(() => {
    console.log("currentPlan", currentPlan);
  }, [currentPlan]);
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
        setBadgesData(res.payload.data.data);
        let badgeData = res.payload.data.data;
        setSelectedGlb(badgeData[0].image);
        setNoDataFoundText("Create a match to start collecting");

        setIsLoader(false);
      } else {
        console.log("res--> 133");
        setIsLoader(false);
        setNoDataFoundText("Create a match to start collecting");
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
      setIsLoader(false);

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
  const getBadgeUserList = async () => {
    //    console.log("SeasonId 311", SeasonId);

    const paramObj = new FormData();

    paramObj.append("badges_id", badgesData[currentPlan]?.id);
    try {
      const res = await dispatch(getBadgeUserListAction(paramObj));

      console.log("res--> 371", res.payload.data);
      setIsLoader(false);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);

        setUserListData(res.payload.data.data);
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
  const getUserPoint = async () => {
    console.log("gameData", selectedBadgedData);
    //    console.log("SeasonId 311", SeasonId);

    const object = {
      state: filters.state,
      pincode: filters.local,
      badgeId: badgesData[currentPlan]?.id,
      radius: Math.round(sliderValue),
    };
    console.log("object 314", object);

    try {
      const res = await dispatch(getUserPointsAction(object));

      console.log("res--> 371", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setPointsData(res.payload.data.data);
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
  useEffect(() => {
    setPlayAnimation("idle case");
  }, []);

  const handlePlayOpen = () => {
    setPlayAnimation("Case open");
  };
  const handlePlayShowReward = () => {
    setIsOpened(true);
    setIsOpenedFinished(false);
    setPlayAnimation("Badge coming out");
  };

  const handlePlayPutBack = () => {
    setPlayAnimation("Badge going back in");
    setIsOpened(false);
  };

  const handlePlayClose = () => {
    setIsOpenedFinished(false);
    setPlayAnimation("Case closing and idle");
    setIsOpened(false);
  };

  function Leaderboard() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black06 bg-opacity-50">
        <div className="bg-black26 text-white p-6 rounded shadow-lg max-w-md w-full">
          {/* Status Bar */}
          {/* Header */}
          <div className="flex items-center justify-center px-4 py-2 relative">
            <button
              onClick={() => {
                setIsFilter(true);
                setIsRanking(false);
              }}
              className="absolute left-4"
            >
              {/* Add your filter icon here */}
              <img src="/images/filter.svg" alt="Filter" className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-medium text-center">
              {badgesData[currentPlan]?.name}
            </h1>
          </div>
          {/* Leaderboard */}
          <div className="px-4 py-6">
            <div className="flex justify-between mb-4">
              <div className="text-xl">UserName</div>
              <div className="text-xl">Ranking points</div>
            </div>
            {pointsListData.map((item, i) => (
              <div key={i} className="flex justify-between py-2">
                <div className="text-xl">{item.username}</div>
                <div className="text-xl">{item.allpoints}</div>
              </div>
            ))}
          </div>
          {/* Close Button */}
          {/* <button className="w-full bg-yellow hover:bg-yellow-500 text-black text-lg rounded-lg py-6">
            Close
          </button> */}

          <button
            onClick={() => {
              setIsRanking(false);
              setFilters({
                all: false,
                local: false,
                state: false,
              });
              setSliderValue(0);
            }}
            className="bg-yellow text-black06 w-full py-2 rounded-lg hover:bg-yellow-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const Filter = () => {
    const handleCheckboxChange = (type) => {
      if (type === "all") {
        const newAllValue = !filters.all;
        setFilters({
          all: newAllValue,
          local: newAllValue,
          state: newAllValue,
        });
      } else {
        const newFilters = {
          ...filters,
          [type]: !filters[type],
        };
        // Automatically check/uncheck "All" based on other checkboxes
        newFilters.all = newFilters.local && newFilters.state;
        setFilters(newFilters);
      }
    };

    return (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray30 bg-opacity-50">
        <div className="bg-gray30 rounded-lg p-6 w-72 text-white relative">
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          <button
            className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-500"
            onClick={() => {
              setFilters({ all: false, local: false, state: false });
              setIsFilter(false);
              setIsRanking(true);
            }}
          >
            ✕
          </button>
          <div className="flex flex-col space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.all}
                onChange={() => handleCheckboxChange("all")}
              />
              All
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.local}
                onChange={() => handleCheckboxChange("local")}
              />
              Local
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.state}
                onChange={() => handleCheckboxChange("state")}
              />
              State
            </label>
          </div>
          <div className="my-4 text-center">OR</div>
          <div className="flex items-center justify-between mb-6">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              className="w-full"
            />
            <span className="ml-2">{sliderValue}</span>
          </div>
          <button
            onClick={() => {
              setIsFilter(false);
              setIsRanking(true);
            }}
            className="bg-yellow text-black06 w-full py-2 rounded-lg hover:bg-yellow-500"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  console.log(badgesData, "badgesData");

  function BadgeDialog() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black06 bg-opacity-50">
        <div className="bg-black26 text-white p-6 rounded shadow-lg max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-bold text-black">
              {badgesData[currentPlan]?.name}
            </div>

            {/* Placeholder for user's level */}
          </div>

          {/* Username */}

          {userListData.map((item, index) => (
            <div>
              <div className="text-lg font-semibold text-black mb-2">
                {item.username}
              </div>

              {/* Game title */}
              <div className="text-sm text-gray-600 mb-4">
                {item.badgesgamename}
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-300 mb-4" />
            </div>
          ))}

          {/* Close button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setIsBadgeDialog(false);
              }}
              className="text-white bg-black py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="bg-black26 h-full">
          {badgesData.length > 0 ? (
            <div className="container mx-auto  bg-black26 h-full">
              {/* <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setIsRanking(true);
                  }}
                >
                  <h2 className="text-3xl mt-6 font-semibold mb-2 text-white ml-8">
                    Ranking
                  </h2>
                </button>
                <button onClick={toggleModal} className="mr-8">
                  <img
                    src="/images/filter.svg"
                    alt="Filter"
                    className="w-6 h-6"
                  />
                </button>
              </div> */}
              {/* {badgesData.map((item, index) => (
              <div
                key={item.id}
                className="bg-black25 text-white p-6 rounded-lg shadow-lg border border-gray82 mr-4 ml-8 mt-8"
              >
                <img
                  src={item.image}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600">{user.data.username}</p>
              </div>
            ))} */}

              {/* {badgesData.length > 0 ? ( */}
              {badgesData.length > 0 ? (
                <div className="flex flex-col items-center justify-center  bg-red">
                  <div className="relative w-full overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      // style={{
                      //   transform: `translateX(0%)`,
                      // }}
                    >
                      <div
                        className={`flex-shrink-0  w-full text-white overflow-hidden transition-all duration-300 ease-in-out transform   
                      }`}
                      >
                        <div className="flex justify-center items-center h-full">
                          <div
                            className="object-contain max-w-full max-h-full  shadow-lg  bg-black06   w-[100vw] h-[100vh]"
                            onClick={() => {
                              getBadgeUserList();
                              setIsBadgeDialog(true);
                            }}
                          >
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-full h-full">
                              <h2 className="absolute left-0 top-20 transform -translate-y-1/2 z-10 text-lg font-semibold ml-4 mt-2">
                                {badgesData[currentPlan]?.name}
                              </h2>
                              <p className="absolute left-0 top-28 transform -translate-y-1/2 z-10 text-gray-600 ml-4 mb-2 ">
                                {user.data.username}
                              </p>
                              <Canvas
                                key={
                                  badgesData[currentPlan]?.image || currentPlan
                                }
                                scene={scene}
                                camera={{ position: [0, 3.6, 3.5] }}
                                gl={{ physicallyCorrectLights: true }}
                                onCreated={(state) => {
                                  const _gl = state.gl.getContext();
                                  const pixelStorei = _gl.pixelStorei.bind(_gl);
                                  _gl.pixelStorei = function (...args) {
                                    const [parameter] = args;
                                    switch (parameter) {
                                      case _gl.UNPACK_FLIP_Y_WEBGL:
                                        return pixelStorei(...args);
                                    }
                                  };
                                  cameraRef.current = state.camera;
                                }}
                              >
                                <OrbitControls
                                  enablePan={false}
                                  enabled={isShowOutFinished}
                                />
                                <spotLight
                                  position={[0, 2, 1]}
                                  intensity={10}
                                />
                                <ambientLight intensity={1} />
                                <Suspense fallback={null}>
                                  <Environment preset="forest" />
                                  <Model
                                    playAnimation={playAnimation}
                                    setIsOpenedFinished={setIsOpenedFinished}
                                    setIsClosedFinished={setIsClosedFinished}
                                    setIsShowOutFinished={setIsShowOutFinished}
                                    cameraState={cameraRef}
                                    isOpened={isOpened}
                                    selectedglbmodal={
                                      badgesData[currentPlan]?.image
                                    }
                                  />
                                </Suspense>
                              </Canvas>
                            </div>
                          </div>
                          <div className="flex mt-4 justify-between items-center absolute  top-6 transform -translate-y-1/2 z-10 w-full">
                            <button
                              onClick={() => {
                                setIsRanking(true);
                              }}
                            >
                              <h2 className="text-3xl font-semibold mb-2 text-white ml-4">
                                Ranking
                              </h2>
                            </button>
                            <button onClick={toggleModal} className="mr-4">
                              <img
                                src="/images/filter.svg"
                                alt="Filter"
                                className="w-6 h-6"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Previous button */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={prevPlan}
                    >
                      <img
                        src="/images/previousArrow.svg"
                        alt="Previous"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Next button */}
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={nextPlan}
                    >
                      <img
                        src="/images/nextArrow.svg"
                        alt="Next"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>

                  {/* Indicator dots */}
                  <div className="absolute  bottom-24 transform -translate-y-1/2 z-10 flex mt-4 space-x-2">
                    {badgesData.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentPlan ? "bg-white" : "bg-gray6E"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute  bottom-2 transform -translate-y-1/2 z-10 controls-view ">
                    {isClosedFinished && (
                      <button
                        className="modal-button bg-[#d4d43b] text-[#333232] py-2 px-4 rounded-lg mt-2 hover:bg-purple-400 mx-2"
                        onClick={handlePlayOpen}
                      >
                        Open
                      </button>
                    )}

                    {isOpenedFinished && (
                      <button
                        className="modal-button bg-[#d4d43b] text-[#333232] py-2 px-4 rounded-lg mt-2 hover:bg-purple-400  mx-2"
                        onClick={handlePlayClose}
                      >
                        Close
                      </button>
                    )}

                    {isOpenedFinished && !isShowOutFinished && (
                      <button
                        className="modal-button bg-[#d4d43b] text-[#333232] py-2 px-4 rounded-lg mt-2 hover:bg-purple-400  mx-2"
                        onClick={handlePlayShowReward}
                      >
                        Show Reward
                      </button>
                    )}

                    {isShowOutFinished && (
                      <button
                        className="modal-button bg-[#d4d43b] text-[#333232] py-2 px-4 rounded-lg mt-2 hover:bg-purple-400  mx-2"
                        onClick={handlePlayPutBack}
                      >
                        Put Back
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-white text-3xl text-center mt-8">
                  No badge available
                </div>
              )}
            </div>
          ) : (
            <div className=" text-white text-3xl text-center pt-[30%]     bg-black26 h-screen">
              {noDataFoundText}
            </div>
          )}
          {isBadgeDialog && <BadgeDialog />}
          {isRanking && <Leaderboard />}
          {isFilter && <Filter />}
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
        </div>
      )}
    </>
  );
};

export default Ranking;
