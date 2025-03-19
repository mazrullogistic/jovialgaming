// components/Model.js
import { useRef, useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { getData, setChatUserData, setModelChatData } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import Loader from "../Loader";
import { CommonConstant, EmitterKey } from "@/constants/keywords";
import socket from "@/socket/socket";
import { toast } from "react-toastify";
import EventEmitter from "@/components/EventEmitter";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

const Model = ({
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
  isModelShow,
  isWageringStop,
  isSubscription,
  notificationNumber,
  isChallenge,
}) => {
  const [selectedBox, setSelectedBox] = useState(0);
  const [selectedBoxMatch, setSelectedBoxMatch] = useState(0);
  const [selectedModelIndex, setSelectedModelIndex] = useState(
    selectedIndex ? selectedIndex : 0
  );
  const [submitScoreDialog, setSubmitScoreDialog] = useState(submitScoreModel);
  const [iWonLossModelDialog, setIWonLossModelDialog] = useState(false);
  const [modelVisible, setModelVisible] = useState(isModelShow);
  const [scoreText, setScoreText] = useState("");
  const [selectedAmountData, setSelectedAmountData] = useState(amountData[0]);
  const [selectionMatchData, setSelectionMatchData] =
    useState(selectedMatchData);
  const [selectedGameModeData, setSelectedGameModeData] = useState(
    gameModes[0]
  );
  const route = useRouter();

  const user = getData("user");

  const handleBoxClick = (index, item) => {
    if (isWageringStop == 0 || item.amount == "Free Play") {
      setSelectedBox(index);
      setSelectedAmountData(item);
    } else {
      toast.error("All wagering is prohibited in this room");
    }
  };
  const handleBoxClickMatch = (index, item) => {
    setSelectedGameModeData(item);

    setSelectedBoxMatch(index);
  };
  const handleChangeNext = (item) => {
    console.log("item) =", selectedAmountData);
    console.log("isSubscription", isSubscription);
    console.log("item", item.amount);

    const userBalance = user.data.balance;
    const total = selectedAmountData.amount;
    console.log("userBalance", userBalance);
    if (isSubscription == 0 && selectedAmountData.amount == "Free Play") {
      toast.error("Please subscribe to continue.");
    } else {
      if (isWageringStop == 0 || selectedAmountData.amount == "Free Play") {
        if (userBalance >= total || selectedAmountData.amount == "Free Play") {
          setSelectedModelIndex(2);
        } else {
          toast.error(
            "You cannot create more matches than the amount in your funds, please delete one match to create this one."
          );
        }
      } else {
        toast.error("All wagering is prohibited in this room");
      }
    }
  };
  const handleChangeStartGame = () => {
    if (!isChallenge) {
      setSelectedModelIndex(3);
    } else {
      closeModel();
    }
    getModelData(selectedAmountData, selectedGameModeData);
  };
  const handleChangePreviuos = () => {
    closeModel();

    setSelectedModelIndex(1);
  };
  const handleChangeSearching = () => {
    setSelectedModelIndex(1);
    closeModel();
  };
  useEffect(() => {
    CommonConstant.selectedMatchIndex = selectedModelIndex;

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
  const router = useRouter();

  const handleRedirect = () => {
    const chatId = matchData
      ? user.data.id !== matchData.host_user_id
        ? matchData.host_user_id
        : matchData.opponent_user_id
      : null;

    if (chatId) {
      const chatName = matchData
        ? user.data.id !== matchData.host_user_id
          ? matchData.host_name
          : matchData.opponent_name
        : "";

      const imgUrl = matchData
        ? user.data.id !== matchData.host_user_id
          ? matchData.host_image
          : matchData.opponent_image
        : "default.png";
      CommonConstant.userDataForChat = "";
      setChatUserData("chat", "");
      setModelChatData("chatId", {
        id: chatId,
        name: chatName,
        imgUrl: imgUrl,
      });

      console.log("chatId", chatId, "imgUrl", imgUrl);
      CommonConstant.selectedMatchIndex = selectedModelIndex;

      router.push(`${PATH_DASHBOARD.msgChat}`);
      closeModel();
    }
  };

  function renderGameMode() {
    return (
      <div>
        <div className='model-txt'>Select Game Mode</div>

        <div className='ml-[14%] md:ml-[32%]'>
          {gameModes.map((item, index) => (
            // <div className="border border-x-white border-">
            <button onClick={() => handleBoxClickMatch(index, item)}>
              <div
                className={`w-56  h-10 mt-6 bg-black25 rounded-xl pt-[1px] border   items-center justify-center ${
                  selectedBoxMatch === index ? "border-yellow" : "border-white"
                }`}>
                <div className='text-center text-white mt-[2.3%]'>
                  {item.name}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div>
          <div className='center-container space-x-3 mt-8'>
            <button className='btn-challenge ' onClick={handleChangePreviuos}>
              {"Close"}
            </button>

            <button className='btn-challenge' onClick={handleChangeStartGame}>
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
        <div className='model-txt'>Choose an entry amount</div>

        <div className='grid grid-cols-3 md:ml-24 ml-8 mt-4'>
          {amountData.map((item, index) => (
            <button
              key={index}
              className='mt-6 mb-2'
              onClick={() => handleBoxClick(index, item)}>
              <div
                className={`rounded-xl h-16 w-16 flex items-center justify-center ${
                  selectedBox === index ? "bg-yellow" : "bg-black06"
                }`}>
                <div
                  className={`text-center text-[16px] font-[400]  ${
                    selectedBox === index ? "text-black06" : "text-white"
                  }`}>
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
          <div className='center-container space-x-3 mt-8'>
            <button className='btn-challenge ' onClick={closeModel}>
              {"Close"}
            </button>

            <button className='btn-challenge' onClick={handleChangeNext}>
              {"Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  function renderFindingMatch() {
    return (
      <div className='flex justify-center items-center h-full'>
        <div className='w-full max-w-[56rem] p-4'>
          <button className='w-full'>
            <div className='w-full bg-black25 p-4 flex flex-col justify-center items-center rounded-md'>
              <div className='flex justify-center items-center mb-4'>
                <img
                  src='/images/dollar.svg'
                  className='h-[125px] w-[125px] md:h-[150px] md:w-[150px]'
                />
              </div>

              <div className='text-center text-white text-[16px] md:text-[18px] font-inter_tight font-[200] animate-blink mb-4'>
                {"Finding a match ..."}
              </div>

              <Image
                src='/images/search.png'
                className='mt-6 mb-4'
                width={25}
                height={25}
                alt='Logo'
              />

              <button
                className='btn-challenge w-full  mt-6 bg-blue-500 text-white rounded-md'
                onClick={handleChangeSearching}>
                {"Close"}
              </button>
            </div>
          </button>
        </div>
      </div>
    );
  }
  function renderFoundMatch() {
    return (
      <div className='flex justify-center items-center'>
        <div className='w-full md:w-2/3 lg:w-1/3 xl:w-1/4 h-72'>
          <button className='w-full h-full bg-black25 flex flex-col justify-center items-center p-4'>
            <button
              onClick={handleRedirect}
              className='absolute top-4 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200'>
              <ChatBubbleLeftEllipsisIcon className='w-5 h-5 md:w-6 md:h-6' />
              {notificationNumber > 0 && (
                <span className='absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                  {notificationNumber}
                </span>
              )}
            </button>
            <div className='flex justify-center items-center mb-4'>
              <img src='/images/dollar.svg' className='h-[125px] w-[125px]' />
            </div>
            <div className='text-center text-white mt-4 text-[20px] font-inter_tight font-[300]'>
              {"Found a match "}
            </div>
            <div className='flex justify-around mt-4'>
              <button
                className='btn-accept bg-green-500 text-white rounded-md'
                onClick={onPressAccept}>
                {"Accept"}
              </button>
            </div>
            <button
              className='btn-Decline px-4 py-2 bg-red-500 text-white rounded-md'
              onClick={onPressDecline}>
              {"Decline"}
            </button>
          </button>
        </div>
      </div>
    );
  }

  function renderMatchRule() {
    return (
      <div>
        <div className='model-txt text-center'>Rules</div>

        <div>
          <div className='overflow-y-auto max-h-[400px]'>
            {ruleData.length > 0 ? (
              ruleData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleBoxClickMatch(index, item)}
                  className='w-full' // Ensure the button takes full width
                >
                  <div className='mt-6  rounded-xl mb-2 bg-gray30  mr-2 p-4 w-full'>
                    <div className='text-white text-left'>{item.title}</div>
                    <hr className='my-divider' />

                    <div className='text-white text-left'>
                      {item.descriptions}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className=' h-[250px]  '>
                <p className='text-[18px] text-white  font-inter_tight font-[600] text-center pt-[110px]'>
                  No data Found
                </p>
              </div>
            )}
          </div>

          <div className='center-container space-x-3 mt-8'>
            <button className='btn-accept-rules' onClick={onPressAcceptRules}>
              {"Accept Rules"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderMatchUsers() {
    console.log("matchData 307", matchData);
    console.log("user.data.id 307", user.data.id);
    return (
      <div className='max-h-[800px] relative'>
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2'>
          <p className='text-[18px] text-white font-inter_tight font-[300] text-center '>
            {"GAME RULES 3"}
          </p>

          <p className='text-[16px] text-white font-inter_tight font-[300] text-center mt-2 '>
            Add opponent as friend on console. <br />
            Match creator send game invite
            <br />
            Submit scores when finished.
          </p>
          <p className='text-[20px] text-white font-inter_tight font-[300] text-center mt-16 '>
            {"GAME TIME "}
          </p>

          {readyTimes ? (
            <p className='text-[16px] text-white font-inter_tight font-[300] text-center   '>
              {readyTimes}
            </p>
          ) : null}
        </div>

        <div className='flex max-h-[700px]  '>
          <div className='w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={
                  matchData
                    ? user.data.id !== matchData.host_user_id
                      ? matchData.host_image !== ""
                        ? matchData.host_image
                        : "/images/logo.png"
                      : matchData.opponent_image !== ""
                      ? matchData.opponent_image
                      : "/images/logo.png"
                    : "/images/logo.png"
                }
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>
                {matchData
                  ? user.data.id !== matchData.host_user_id
                    ? matchData.host_name
                    : matchData.opponent_name
                  : ""}
              </p>
            </div>
          </div>
          <div className='w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%]   max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={
                  matchData
                    ? user.data.id === matchData.host_user_id
                      ? matchData.host_image !== ""
                        ? matchData.host_image
                        : "/images/logo.png"
                      : matchData.opponent_image !== ""
                      ? matchData.opponent_image
                      : "/images/logo.png"
                    : "/images/logo.png"
                }
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>
                {matchData
                  ? user.data.id === matchData.host_user_id
                    ? matchData.host_name
                    : matchData.opponent_name
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {readyClick ? (
          <button className='w-[300px] h-[40px] text-white text-center font-[300] rounded-xl font-inter_tight bg-gray30 absolute left-1/2 transform -translate-x-1/2 bottom-4'>
            {"Your opponent is not ready"}
          </button>
        ) : (
          <button
            onClick={onPressReady}
            className='w-[150px] h-[40px] text-white text-center font-[500] rounded-full font-inter_tight bg-blueF0 absolute left-1/2 transform -translate-x-1/2 bottom-4'>
            {"READY"}
          </button>
        )}

        <button
          onClick={handleRedirect}
          className='absolute top-4 right-16 md:right-16 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200'>
          <ChatBubbleLeftEllipsisIcon className='w-5 h-5 md:w-6 md:h-6' />
          {notificationNumber > 0 && (
            <span className='absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {notificationNumber}
            </span>
          )}
        </button>
      </div>
    );
  }
  function renderScoreSubmit() {
    console.log("matchData 373", matchData);

    return (
      <div className='max-h-[800px] relative'>
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2'>
          <p className='text-[18px] text-white font-inter_tight font-[300] text-center'>
            {"GAME RULES 2"}
          </p>

          <p className='text-[16px] text-white font-inter_tight font-[300] text-center mt-2'>
            Add opponent as friend on console. <br />
            Match creator send game invite
            <br />
            Submit scores when finished.
          </p>

          <p className='text-[20px] text-white font-inter_tight font-[300] text-center mt-16'>
            {"GAME TIME"}
          </p>

          {/* Message Icon Button */}
          {readyTimes ? (
            <p className='text-[16px] text-white font-inter_tight font-[300] text-center'>
              {readyTimes}
            </p>
          ) : null}
        </div>

        <div className='flex max-h-[700px]'>
          <div className='w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={matchData.opponent_image}
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>{matchData.opponent_name}</p>
            </div>
          </div>
          <div className='w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%] max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={matchData.host_image}
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>{matchData.host_name}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onPressReady}
          className='w-[200px] h-[40px] text-black text-center font-[400] rounded-xl font-inter_tight bg-grayA4 absolute left-1/2 transform -translate-x-1/2 bottom-4'>
          {"Score Submitted"}
        </button>
        <button
          onClick={handleRedirect}
          className='absolute top-4 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200'>
          <ChatBubbleLeftEllipsisIcon className='w-5 h-5 md:w-6 md:h-6' />
          {notificationNumber > 0 && (
            <span className='absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {notificationNumber}
            </span>
          )}
        </button>
      </div>
    );
  }
  function renderMatchUsersScore() {
    return (
      <div className='max-h-[800px] relative'>
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2'>
          <p className='text-[18px] text-white font-inter_tight font-[300] text-center '>
            {"GAME RULES"}
          </p>

          <p className='text-[16px] text-white font-inter_tight font-[300] text-center mt-2 '>
            Add opponent as friend on console. <br />
            Match creator send game invite
            <br />
            Submit scores when finished.
          </p>
        </div>
        <div className='flex max-h-[700px]'>
          <div className='w-[50%] bg-black06 h-screen md:pl-[15%] pl-[5%] md:pt-[42%] pt-[102%] max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={matchData.opponent_image}
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>{matchData.opponent_name}</p>
            </div>
          </div>
          <div className='w-[50%] bg-black06 h-screen pl-[8%] md:pl-[15%] md:pt-[42%] pt-[102%]   max-h-[700px]'>
            <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4'>
              <img
                className='rounded-full h-full w-full object-cover'
                src={matchData.host_image}
                alt='Profile Picture'
              />
            </div>
            <div className='w-32'>
              <p className='userName-txt'>{matchData.host_name}</p>
            </div>
          </div>
        </div>
        <div className='absolute left-1/2 transform -translate-x-1/2 bottom-4'>
          <p className='text-[16px] text-white font-inter_tight font-[300] text-center mb-4'>
            Submit scores when finished. <br />
            Good Luck!'
          </p>
          <button
            onClick={() => {
              setIWonLossModelDialog(true);
            }}
            className='w-[200px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-yellow '>
            Submit Score
          </button>
        </div>

        {/* Message Icon in Top-Right Corner */}
        <button
          onClick={handleRedirect}
          className='absolute top-4 right-4 flex items-center gap-2 text-white px-2 py-1 md:px-3 md:py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition duration-200'>
          <ChatBubbleLeftEllipsisIcon className='w-5 h-5 md:w-6 md:h-6' />
          {notificationNumber > 0 && (
            <span className='absolute -top-2 -right-2 bg-white text-black06 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {notificationNumber}
            </span>
          )}
        </button>

        {iWonLossModelDialog && renderWonLost()}
        {selectionMatchData?.isResultAddedHost == "1" && renderSubmitScore()}
        {submitScoreDialog && renderSubmitScore()}
      </div>
    );
  }
  function renderWonLost() {
    return (
      <div>
        <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px] transparent-style'></div>
        <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px]  '>
          <div className='w-full  h-[60%] '></div>
          <div className='bg-black25 h-[40%] rounded-t-lg ml-2 mr-2 flex flex-col items-center'>
            <div className='flex  w-full'>
              <p className='text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  ml-[6%]'>
                How was the match?
              </p>
              <button
                className='  w-[3%] mr-[3%] mt-[2%]'
                onClick={() => {
                  setIWonLossModelDialog(false);
                }}>
                <Image
                  src='/images/close.svg'
                  alt='close'
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className=' flex flex-col space-y-4 mt-[10%]'>
              <button
                onClick={() => {
                  setIWonLossModelDialog(false);
                  setSubmitScoreDialog(true);
                  matchResultApi(1);
                }}
                className='w-[150px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-green'>
                I Won 😎
              </button>
              <button
                onClick={() => {
                  setIWonLossModelDialog(false);

                  setSubmitScoreDialog(true);
                  matchResultApi(0);
                }}
                className='w-[150px] h-[40px] text-black06 text-center font-[400] rounded-xl font-inter_tight bg-red '>
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
        <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px] transparent-style'></div>
        <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.5px]  w-full h-[700px]  '>
          <div className='w-full  h-[60%] ' />
          <div className='bg-black25 h-[40%] rounded-t-lg ml-2 mr-2 flex flex-col items-center'>
            <div className='flex  w-full'>
              <p className='text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  ml-[6%]'>
                Enter your score
              </p>
              <button
                className='  w-[3%] mr-[3%] mt-[2%]'
                onClick={() => {
                  setSubmitScoreDialog(false);
                }}>
                <Image
                  src='/images/close.svg'
                  alt='close'
                  width={22}
                  height={22}
                />
              </button>
            </div>
            <div className=' flex    mt-[8%] w-[100%]'>
              <div className='  flex flex-col items-center justify-center w-[50%]'>
                <div className='rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center border-white border-2'>
                  <img
                    className='rounded-full h-full w-full object-cover'
                    //  src={matchData.opponent_image}

                    src={
                      matchData
                        ? user.data.id !== matchData.host_user_id
                          ? matchData.host_image !== ""
                            ? matchData.host_image
                            : "/images/logo.png"
                          : matchData.opponent_image !== ""
                          ? matchData.opponent_image
                          : "/images/logo.png"
                        : "/images/logo.png"
                    }
                    alt='Profile Picture'
                  />
                </div>
                <p className='text-[16px] text-white font-inter_tight font-[200] text-center pt-2 w-[20%]'>
                  {matchData && user.data.id !== matchData.host_user_id
                    ? matchData.host_name
                    : matchData.opponent_name}
                </p>
                <p className='text-[16px] text-white font-inter_tight font-[200] text-center pt-2 w-[20%] h-8'>
                  {matchData.opponent_score_count
                    ? matchData.opponent_score_count
                    : 0}
                  {/* {matchData.opponent_score_count} */}
                </p>
              </div>
              <div className='  flex flex-col items-center justify-center w-[60%]'>
                <div className='rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center border-white border-2'>
                  <img
                    className='rounded-full h-full w-full object-cover'
                    src={
                      matchData
                        ? user.data.id === matchData.host_user_id
                          ? matchData.host_image !== ""
                            ? matchData.host_image
                            : "/images/logo.png"
                          : matchData.opponent_image !== ""
                          ? matchData.opponent_image
                          : "/images/logo.png"
                        : "/images/logo.png"
                    }
                    alt='Profile Picture'
                  />
                </div>
                <p className='text-[16px] text-white font-inter_tight font-[300] text-center pt-2 w-[20%]'>
                  {matchData && user.data.id === matchData.host_user_id
                    ? matchData.host_name
                    : matchData.opponent_name}
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
                  placeholder='Enter Score'
                  className='w-[100px]       text-[14px] h-8 mt-2 rounded-xl text-white bg-gray82 outline-none pl-2'
                  onChange={(event) => {
                    setScoreText(event.target.value);
                  }}
                />
              </div>
            </div>

            {isSubmitScoreBtn ? (
              <p className='text-[14px] text-white font-inter_tight font-[200] text-center   pt-2 w-[88%]   '>
                Please wait for opponent to <br /> enter score!
                <br />
                {scoreTimeCount}
              </p>
            ) : (
              <button
                className='    w-[140px]  text-center border-[1px] rounded-xl   text-black06 font-inter_tight bg-yellow mb-2 p-2 mt-2'
                onClick={() => {
                  submitScoreApi(scoreText);
                }}>
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
      <div className='max-h-[800px] relative flex justify-center items-center'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full  '>
          {/* {!CommonConstant?.FreePlayData?.amount !== "Free Play" && (
            <p className="w-full h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-green ">
              {"$ " + amount + " has been added to your funds"}
            </p>
          )}  */}

          {/* FreePlay Changes */}
          {/* {!["Free Play", "free play"].includes(
            CommonConstant?.FreePlayData?.amount
          ) && (
            <p className='w-full md:h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-green '>
              {"$ " + amount + " has been added to your funds"}
            </p>
          )} */}
          <Image
            src='/images/cup.svg'
            width={125}
            height={125}
            alt='Logo'
            className='mt-12'
          />
          <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4 mt-24'>
            <img
              className='rounded-full h-full w-full object-cover'
              src={user.data.image}
            />
          </div>
        </div>
        <div className='flex max-h-[700px] w-full'>
          <div className='w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]'></div>
          <div className='w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]'></div>
        </div>

        <button
          onClick={() => {
            CommonConstant.CurrentGameDetails = "";
            CommonConstant.SelectedMatchData = "";
            // socket.stop();
            EventEmitter.emit(EmitterKey.profile, "");
            closeModel();
            route.replace(PATH_DASHBOARD.home);
          }}
          className='w-[250px] h-[40px] text-black text-center font-[500] rounded-xl font-inter_tight bg-yellow absolute left-1/2 transform -translate-x-1/2 bottom-4'>
          {"Find another match"}
        </button>
      </div>
    );
  }
  function renderRematch() {
    var amount = readyTimerData ? readyTimerData.amount : matchData.amount;
    return (
      <div className='max-h-[800px] relative flex justify-center items-center'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full  '>
          {/* FreePlay Changes */}

          {/* {!["Free Play", "free play"].includes(
            CommonConstant?.FreePlayData?.amount
          ) && (
            <p className='w-full md:h-10 pt-1 rounded-sm text-[18px] text-white font-inter_tight font-[300] text-center bg-red'>
              {"$ " + amount + " has been deducted from your funds"}
            </p>
          )} */}
          <Image
            src='/images/cross.svg'
            width={100}
            height={100}
            alt='Logo'
            className='mt-12'
          />

          <div className='rounded-full h-32 w-32 bg-gray-300 flex items-center justify-center border-white border-4 mt-24'>
            <img
              className='rounded-full h-full w-full object-cover'
              src={user.data.image}
            />
          </div>
          <button
            onClick={() => {
              CommonConstant.CurrentGameDetails = "";
              CommonConstant.SelectedMatchData = "";
              //socket.stop();
              EventEmitter.emit(EmitterKey.profile, "");

              route.replace(PATH_DASHBOARD.home);
            }}
            className='w-[200px] h-[40px] text-black text-center font-[500] rounded-xl font-inter_tight bg-grayA4  mt-16  '>
            {"Rematch"}
          </button>
          <p className='text-[18px] text-white font-inter_tight font-[300] text-center   pt-6 w-[88%]  '>
            Feel like you been cheated? Contact us
          </p>
          <a
            onClick={() => {
              console.log("test");
              route.replace(PATH_DASHBOARD.home);
            }}
            href='#'
            className='text-[18px] text-white font-inter_tight font-[300] text-center w-[88%] underline'>
            Dispute Center
          </a>
        </div>
        <div className='flex max-h-[700px] w-full'>
          <div className='w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]'></div>
          <div className='w-[50%] bg-black06 h-screen pl-[15%] pt-[42%] max-h-[700px]'></div>
        </div>
      </div>
    );
  }
  return (
    <Modal
      className='modal-common-block-send'
      isOpen={modelVisible}
      // onRequestClose={closeModal}
      style={customStyles}
      contentLabel='Example Modal'>
      {console.log("isLoader", isLoader)}
      {isLoader && (
        <div className='small-loader'>
          <div className='spinner'></div>
        </div>
      )}

      {selectedModelIndex == 1
        ? renderAmount()
        : /* ? renderAmount() */
        selectedModelIndex == 2
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

export default Model;
