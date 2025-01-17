// components/Model.js
import { useRef, useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import {
  getCurrentTourDetailsData,
  getCurrentTourRoundDetailsData,
  getData,
} from "@/utils/storage";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import Loader from "../Loader";
import { CommonConstant } from "@/constants/keywords";
import socket from "@/socket/socket";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

const TournamentModel = ({
  amountData,
  closeModel,
  getModelData,
  gameModes,
  selectedIndex,
  onPressAccept,
  onPressDecline,
  ruleData,
  onPressAcceptRules,
  readyTimes,
  readyClick,
  onPressReady,
  matchResultApi,
  submitScoreApi,
  scoreTimeCount,
  isSubmitScoreBtn,
  matchData,
  readyTimerData,
  isLoader,
  submitScoreModel,
  selectedMatchData,
}) => {
  const router = useRouter();

  const [gameDetails, setGameDetails] = useState(null);
  const [tourRoundDetails, setTourRoundDetails] = useState(null);
  const [selectedBox, setSelectedBox] = useState(0);
  const [selectedBoxMatch, setSelectedBoxMatch] = useState(0);
  const [selectedModelIndex, setSelectedModelIndex] = useState(selectedIndex);
  const [submitScoreDialog, setSubmitScoreDialog] = useState(submitScoreModel);
  const [iWonLossModelDialog, setIWonLossModelDialog] = useState(false);
  const [scoreText, setScoreText] = useState("");
  const [selectedAmountData, setSelectedAmountData] = useState(amountData[0]);
  const [selectionMatchData, setSelectionMatchData] =
    useState(selectedMatchData);
  const [selectedGameModeData, setSelectedGameModeData] = useState([]);
  // const [selectedGameModeData, setSelectedGameModeData] = useState(
  //   gameModes[0]
  // );
  var currentTourDetails = getCurrentTourDetailsData("tourDetailData");
  var currentTourRoundDetails =
    getCurrentTourRoundDetailsData("tournamentData");
  const route = useRouter();

  const user = getData("user");

  const handleBoxClick = (index, item) => {
    setSelectedAmountData(item);

    setSelectedBox(index);
  };
  const handleBoxClickMatch = (index, item) => {
    setSelectedGameModeData(item);

    setSelectedBoxMatch(index);
  };
  const handleChangeNext = (item) => {
    setSelectedModelIndex(2);
  };
  const handleChangeStartGame = () => {
    setSelectedModelIndex(3);

    getModelData(selectedAmountData, selectedGameModeData);
  };
  const handleChangePreviuos = () => {
    setSelectedModelIndex(1);
  };
  const handleChangeSearching = () => {
    setSelectedModelIndex(2);
  };
  useEffect(() => {
    console.log("selectedModelIndex 47", selectedModelIndex);
    return () => {};
  }, []);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%", // Default for mobile
      maxWidth: "694px", // Ensures it doesn't exceed the desired width on larger screens
      backgroundColor: "#252525",
      borderRadius: "20px",
      padding: "20px", // Reduced padding for mobile
    },
    "@media (min-width: 768px)": {
      content: {
        width: "80%", // Adjust width for tablets
        padding: "30px", // Larger padding for tablets
      },
    },
    "@media (min-width: 1024px)": {
      content: {
        width: "694px", // Fixed width for larger screens
      },
    },
  };
  const [modalIsOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setGameDetails(currentTourDetails);
    setTourRoundDetails(currentTourRoundDetails);
    setSelectedModelIndex(selectedIndex);
    return () => {};
  }, [selectedIndex]);
  useEffect(() => {
    setSubmitScoreDialog(submitScoreModel);
    return () => {};
  }, [submitScoreModel]);
  useEffect(() => {
    setSelectionMatchData(selectedMatchData);
    return () => {};
  }, [selectedMatchData]);
  const handleRedirect = () => {
    router.push("/tournament/timer/tournamentStart/chat");
  };
  // function sendMessage() {
  //   router.push(PATH_DASHBOARD.messages);
  // }

  function renderGameMode() {
    return (
      <div>
        <div className="model-txt">Select Game Mode</div>

        <div className="ml-[32%]">
          {gameModes.map((item, index) => (
            // <div className="border border-x-white border-">
            <button onClick={() => handleBoxClickMatch(index, item)}>
              <div
                className={`w-56  h-10 mt-6 bg-black25 rounded-xl pt-[1px] border   items-center justify-center ${
                  selectedBoxMatch === index ? "border-yellow" : "border-white"
                }`}
              >
                <div className="text-center text-white mt-[2.3%]">
                  {item.name}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div>
          <div className="center-container space-x-3 mt-8">
            <button className="btn-challenge " onClick={handleChangePreviuos}>
              {"Previuos"}
            </button>

            <button className="btn-challenge" onClick={handleChangeStartGame}>
              {"Start Match"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  function renderAmount() {
    return (
      <div>
        <div className="model-txt">Choose an entry amount</div>

        <div className="grid grid-cols-3 ml-24 mt-4">
          {amountData.map((item, index) => (
            <button
              key={index}
              className="mt-6 mb-2"
              onClick={() => handleBoxClick(index, item)}
            >
              <div
                className={`rounded-xl h-16 w-16 flex items-center justify-center ${
                  selectedBox === index ? "bg-yellow" : "bg-black06"
                }`}
              >
                <div
                  className={`text-center text-[16px] font-[400]  ${
                    selectedBox === index ? "text-black06" : "text-white"
                  }`}
                >
                  {item.amount}
                  {item.amount == "Free Play" || item.amount == "free play"
                    ? ""
                    : " $"}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div>
          <div className="center-container space-x-3 mt-8">
            <button className="btn-challenge " onClick={closeModel}>
              {"Close"}
            </button>

            <button className="btn-challenge" onClick={handleChangeNext}>
              {"Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  function renderFindingMatch() {
    return (
      <div>
        <div className="ml-[32%] h-72">
          <button>
            <div
              className={`w-56  h-10  bg-black25    items-center justify-center`}
            >
              <Image
                src="/images/dollar.svg"
                className="ml-14"
                width={125}
                height={125}
                alt="Logo"
              />
              <div className="text-center text-white mt-[2.3%] text-[16px]  font-inter_tight  font-[200] animate-blink">
                {"Finding a match ..."}{" "}
              </div>
              <Image
                src="/images/search.png"
                className="ml-24 mt-6 mb-10"
                width={25}
                height={25}
                alt="Logo"
              />
              <button
                className="btn-challenge "
                onClick={handleChangeSearching}
              >
                {"Previuos"}
              </button>
            </div>
          </button>
        </div>
        <div></div>
      </div>
    );
  }
  function renderFoundMatch() {
    return (
      <div>
        <div className="ml-[32%] h-72">
          <button>
            <div
              className={`w-56  h-10  bg-black25    items-center justify-center`}
            >
              <Image
                src="/images/dollar.svg"
                className="ml-14"
                width={125}
                height={125}
                alt="Logo"
              />
              <div className="text-center text-white mt-[10%] text-[20px]  mb-4  font-inter_tight  font-[300]   ">
                {"Found a match "}
              </div>

              <button className="btn-accept" onClick={onPressAccept}>
                {"Accept"}
              </button>
              <div>
                <button className="btn-Decline" onClick={onPressDecline}>
                  {"Decline"}
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  function renderMatchRule() {
    return (
      <div>
        <div className="model-txt text-center">Rules</div>

        <div>
          <div className="overflow-y-auto max-h-[400px]">
            {ruleData.length > 0 ? (
              ruleData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleBoxClickMatch(index, item)}
                  className="w-full" // Ensure the button takes full width
                >
                  <div className="mt-6  rounded-xl mb-2 bg-gray30  mr-2 p-4 w-full">
                    <div className="text-white text-left">{item.title}</div>
                    <hr className="my-divider" />

                    <div className="text-white text-left">
                      {item.descriptions}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className=" h-[250px]  ">
                <p className="text-[18px] text-white  font-inter_tight font-[600] text-center pt-[110px]">
                  No data Found
                </p>
              </div>
            )}
          </div>

          <div className="center-container space-x-3 mt-8">
            <button className="btn-accept-rules" onClick={onPressAcceptRules}>
              {"Accept Rules"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderMatchUsers() {
    console.log("matchData 307", matchData);
    return (
      <div className="max-h-[800px] relative">
        <button
          onClick={handleRedirect}
          className="absolute top-4 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 md:w-6 md:h-6" />
          {-1 > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {1}
            </span>
          )}
        </button>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <p className="text-[18px] text-white font-inter_tight font-[300] text-center ">
            {currentTourRoundDetails?.userCount == 3 ||
            currentTourRoundDetails?.userCount == 4
              ? "Semi Final "
              : currentTourRoundDetails?.userCount == 2
              ? "Final"
              : `Round ${currentTourRoundDetails?.round}`}
          </p>
          <p className="text-[16px] text-white font-inter_tight font-[300] text-center mt-2 ">
            <br />
          </p>
          <p className="text-[20px] text-white font-inter_tight font-[300] text-center mt-16 ">
            {"GAME TIME"}
          </p>
          {console.log("readyTimes", readyTimes)}
          {readyTimes ? (
            <p className="text-[16px] text-white font-inter_tight font-[300] text-center   ">
              {readyTimes}
            </p>
          ) : null}
        </div>
        <div className="flex max-h-[700px]">
          <div className="w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={gameDetails?.opponent_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{gameDetails?.opponent_name}</p>
            </div>
          </div>
          <div className="w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%]   max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={gameDetails?.host_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{gameDetails?.host_name}</p>
            </div>
          </div>
        </div>
        {readyClick ? (
          <button className="w-[300px] h-[40px] text-white text-center font-[300] rounded-xl font-inter_tight bg-gray30 absolute left-1/2 transform -translate-x-1/2 bottom-4">
            {"Your opponent is not ready"}
          </button>
        ) : (
          <button
            onClick={onPressReady}
            className="w-[150px] h-[40px] text-white text-center font-[500] rounded-full font-inter_tight bg-blueF0 absolute left-1/2 transform -translate-x-1/2 bottom-4"
          >
            {"READY"}
          </button>
        )}
      </div>
    );
  }
  function renderScoreSubmit() {
    console.log("matchData 373", matchData);

    return (
      <div className="max-h-[800px] relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <p className="text-[18px] text-white font-inter_tight font-[300] text-center ">
            {"GAME RULES"}
          </p>
          <p className="text-[16px] text-white font-inter_tight font-[300] text-center mt-2 ">
            Add opponent as friend on console. <br />
            Match creator send game invite
            <br />
            Submit scores when finished.
          </p>
          <p className="text-[20px] text-white font-inter_tight font-[300] text-center mt-16 ">
            {"GAME TIME"}
          </p>
          {console.log("readyTimes", readyTimes)}
          {readyTimes ? (
            <p className="text-[16px] text-white font-inter_tight font-[300] text-center   ">
              {readyTimes}
            </p>
          ) : null}
        </div>
        <div className="flex max-h-[700px]">
          <div className="w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={matchData.opponent_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{matchData.opponent_name}</p>
            </div>
          </div>
          <div className="w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%]   max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={matchData.host_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{matchData.host_name}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onPressReady}
          className="w-[200px] h-[40px] text-black text-center font-[400] rounded-xl font-inter_tight bg-grayA4 absolute left-1/2 transform -translate-x-1/2 bottom-4"
        >
          {"Score Submitted"}
        </button>
      </div>
    );
  }
  function renderMatchUsersScore() {
    return (
      <div className="max-h-[800px] relative">
        <button
          onClick={handleRedirect}
          className="absolute top-4 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 md:w-6 md:h-6" />
          {-1 > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {1}
            </span>
          )}
        </button>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <p className="text-[18px] text-white font-inter_tight font-[300] text-center ">
            {currentTourRoundDetails?.userCount == 3 ||
            currentTourRoundDetails?.userCount == 4
              ? "Semi Final "
              : currentTourRoundDetails?.userCount == 2
              ? "Final"
              : `Round ${currentTourRoundDetails?.round}`}
          </p>
          <p className="text-[16px] text-white font-inter_tight font-[300] text-center mt-2 "></p>
        </div>
        <div className="flex max-h-[700px]">
          <div className="w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={gameDetails?.opponent_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{gameDetails?.opponent_name}</p>
            </div>
          </div>
          <div className="w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%]   max-h-[700px]">
            <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4">
              <img
                className="rounded-full h-full w-full object-cover"
                src={gameDetails?.host_image}
                alt="Profile Picture"
              />
            </div>
            <div className="w-32">
              <p className="userName-txt">{gameDetails?.host_name}</p>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4">
          <p className="text-[16px] text-white font-inter_tight font-[300] text-center mb-4">
            Submit scores when finished. <br />
            Good Luck!'
          </p>
          <button
            onClick={() => {
              setIWonLossModelDialog(true);
            }}
            className="w-[200px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-yellow "
          >
            Submit Score
          </button>
        </div>
        {iWonLossModelDialog && renderWonLost()}
        {selectionMatchData?.isResultAddedHost == "1" && renderSubmitScore()}
        {submitScoreDialog && renderSubmitScore()}
      </div>
    );
  }
  function renderWonLost() {
    return (
      <div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px] transparent-style"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px]  ">
          <div className="w-full  h-[60%] "></div>
          <div className="bg-black25 h-[40%] rounded-t-lg ml-2 mr-2 flex flex-col items-center">
            <div className="flex  w-full">
              <p className="text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  ml-[6%]">
                How was the match?
              </p>
              <button
                className="  w-[3%] mr-[3%] mt-[2%]"
                onClick={() => {
                  setIWonLossModelDialog(false);
                }}
              >
                <Image
                  src="/images/close.svg"
                  alt="close"
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className=" flex flex-col space-y-4 mt-[10%]">
              <button
                onClick={() => {
                  setIWonLossModelDialog(false);
                  setSubmitScoreDialog(true);
                  matchResultApi(1);
                }}
                className="w-[150px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-green"
              >
                I Won 😎
              </button>
              <button
                onClick={() => {
                  setIWonLossModelDialog(false);

                  setSubmitScoreDialog(true);
                  matchResultApi(0);
                }}
                className="w-[150px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-red "
              >
                I Lost 😒
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderSubmitScore() {
    return (
      <div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px] transparent-style"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px]  ">
          <div className="w-full  h-[60%] " />
          <div className="bg-black25 h-[40%] rounded-t-lg ml-2 mr-2 flex flex-col items-center">
            <div className="flex  w-full">
              <p className="text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  ml-[6%]">
                Enter your score
              </p>
              <button
                className="  w-[3%] mr-[3%] mt-[2%]"
                onClick={() => {
                  setSubmitScoreDialog(false);
                }}
              >
                <Image
                  src="/images/close.svg"
                  alt="close"
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className=" flex    mt-[8%] w-[100%]">
              <div className="  flex flex-col items-center justify-center w-[50%]">
                <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center border-white border-2">
                  {/* <img
                    className="rounded-full h-full w-full object-cover"
                    src={gameDetails.opponent_image}
                    alt="Profile Picture"
                  /> */}
                  <img
                    className="rounded-full h-full w-full object-cover"
                    //  src={matchData.opponent_image}

                    src={
                      gameDetails
                        ? user.data.id !== gameDetails.host_user_id
                          ? gameDetails.host_image !== ""
                            ? gameDetails.host_image
                            : "/images/logo.png"
                          : gameDetails.opponent_image !== ""
                          ? gameDetails.opponent_image
                          : "/images/logo.png"
                        : "/images/logo.png"
                    }
                    alt="Profile Picture"
                  />
                </div>
                {/* <p className="text-[16px] text-white font-inter_tight font-[200] text-center pt-2 w-[20%]">
                  {gameDetails.opponent_name}
                </p> */}

                <p className="text-[16px] text-white font-inter_tight font-[200] text-center pt-2 w-[20%]">
                  {gameDetails && user.data.id !== gameDetails.host_user_id
                    ? gameDetails.host_name
                    : gameDetails.opponent_name}
                </p>
                <p className="text-[16px] text-white font-inter_tight font-[200] text-center pt-2 w-[20%] h-8">
                  {gameDetails.opponent_score_count
                    ? gameDetails.opponent_score_count
                    : 0}
                  {/* {matchData.opponent_score_count} */}
                </p>
              </div>
              <div className="  flex flex-col items-center justify-center w-[50%]">
                <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center border-white border-2">
                  {/* <img
                    className="rounded-full h-full w-full object-cover"
                    src={gameDetails.host_image}
                    alt="Profile Picture"
                  /> */}
                  <img
                    className="rounded-full h-full w-full object-cover"
                    src={
                      gameDetails
                        ? user.data.id === gameDetails.host_user_id
                          ? gameDetails.host_image !== ""
                            ? gameDetails.host_image
                            : "/images/logo.png"
                          : gameDetails.opponent_image !== ""
                          ? gameDetails.opponent_image
                          : "/images/logo.png"
                        : "/images/logo.png"
                    }
                    alt="Profile Picture"
                  />
                </div>
                {/* <p className="text-[16px] text-white font-inter_tight font-[300] text-center pt-2 w-[20%]">
                  {gameDetails.host_name}
                </p> */}
                <p className="text-[16px] text-white font-inter_tight font-[300] text-center pt-2 w-[20%]">
                  {gameDetails && user.data.id === gameDetails.host_user_id
                    ? gameDetails.host_name
                    : gameDetails.opponent_name}
                </p>
                {/* <input
                  placeholder="Enter Score"
                  className="w-[30%] text-[14px]   h-8 mt-2    rounded-xl text-white bg-gray6E outline-none    pl-2"
                  onChange={(event) => {
                    console.log("test" + event.target.value);
                    setScoreText(event.target.value);
                  }}
                /> */}
                <input
                  placeholder="Enter Score"
                  className="w-[100px]       text-[14px] h-8 mt-2 rounded-xl text-white bg-gray82 outline-none pl-2"
                  onChange={(event) => {
                    setScoreText(event.target.value);
                  }}
                />
              </div>
            </div>

            {isSubmitScoreBtn ? (
              <p className="text-[14px] text-white font-inter_tight font-[200] text-center   pt-2 w-[88%]   ">
                Please wait for opponent to <br /> enter score!
                <br />
                {scoreTimeCount}
              </p>
            ) : (
              <button
                className="btn-accept-rules mt-6"
                onClick={() => {
                  submitScoreApi(scoreText);
                }}
              >
                {"Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderFindAnotherMatch() {
    var amount = readyTimerData ? readyTimerData.amount : matchData.amountCal;

    return (
      <div className="max-h-[800px] relative flex justify-center items-center">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full  ">
          {/* {!CommonConstant?.FreePlayData?.amount !== "Free Play" && (
            <p className="w-full h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-green ">
              {"$ " + amount + " has been added to your funds"}
            </p>
          )}  */}
          {!["Free Play", "free play"].includes(
            CommonConstant?.FreePlayData?.amount
          ) && (
            <p className="w-full md:h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-green ">
              {"$ " + amount + " has been added to your funds"}
            </p>
          )}
          <Image
            src="/images/cup.svg"
            width={125}
            height={125}
            alt="Logo"
            className="mt-12"
          />
          <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4 mt-24">
            <img
              className="rounded-full h-full w-full object-cover"
              src={user.data.image}
            />
          </div>
        </div>
        <div className="flex max-h-[700px] w-full">
          <div className="w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]"></div>
          <div className="w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]"></div>
        </div>

        <button
          onClick={() => {
            CommonConstant.CurrentGameDetails = "";
            CommonConstant.SelectedMatchData = "";
            // socket.stop();

            if (CommonConstant?.matchTournamentData?.winnerId !== 0) {
              route.replace(PATH_DASHBOARD.home);
            } else {
              route.back();
            }
          }}
          className="w-[250px] h-[40px] text-black text-center font-[500] rounded-xl font-inter_tight bg-yellow absolute left-1/2 transform -translate-x-1/2 bottom-4"
        >
          {"Winner"}
        </button>
      </div>
    );
  }
  function renderRematch() {
    var amount = readyTimerData ? readyTimerData.amount : matchData.amount;
    return (
      <div className="max-h-[800px] relative flex justify-center items-center">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full  ">
          {!["Free Play", "free play"].includes(
            CommonConstant?.FreePlayData?.amount
          ) && (
            <p className="w-full md:h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-red">
              {"$ " + amount + " has been deducted from your funds"}
            </p>
          )}
          <Image
            src="/images/cross.svg"
            width={100}
            height={100}
            alt="Logo"
            className="mt-12"
          />

          <div className="rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4 mt-24">
            <img
              className="rounded-full h-full w-full object-cover"
              src={user.data.image}
            />
          </div>
          <button
            onClick={() => {
              CommonConstant.CurrentGameDetails = "";
              CommonConstant.SelectedMatchData = "";
              //socket.stop();
              route.replace(PATH_DASHBOARD.home);
            }}
            className="w-[200px] h-[40px] text-black text-center font-[500] rounded-xl font-inter_tight bg-grayA4  mt-16  "
          >
            {"Continue"}
          </button>
          <p className="text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  ">
            Feel like you been cheated? Contact us
          </p>
          <a
            onClick={() => {
              console.log("test");
              route.replace(PATH_DASHBOARD.home);
            }}
            href="#"
            className="text-[18px] text-white font-inter_tight font-[300] text-center w-[88%] underline"
          >
            Dispute Center
          </a>
        </div>
        <div className="flex max-h-[700px] w-full">
          <div className="w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]"></div>
          <div className="w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]"></div>
        </div>
      </div>
    );
  }
  return (
    <Modal
      className="modal-common-block-send"
      isOpen={true}
      // onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {console.log("isLoader", isLoader)}
      {isLoader && (
        <div className="small-loader">
          <div className="spinner"></div>
        </div>
      )}

      {selectedModelIndex == 1
        ? renderAmount()
        : selectedModelIndex == 2
        ? renderGameMode()
        : selectedModelIndex == 3
        ? renderFindingMatch()
        : selectedModelIndex == 4
        ? renderFoundMatch()
        : selectedModelIndex == 5
        ? renderMatchRule()
        : selectedModelIndex == 6
        ? renderMatchUsers()
        : readyTimerData
        ? readyTimerData.win_status
          ? renderFindAnotherMatch()
          : renderRematch()
        : selectedModelIndex == 9
        ? matchData.winstatus
          ? renderFindAnotherMatch()
          : renderRematch()
        : selectedModelIndex == 11
        ? renderScoreSubmit()
        : renderMatchUsersScore()}
      {/* {renderScoreSubmit()} */}
    </Modal>
  );
};

export default TournamentModel;
