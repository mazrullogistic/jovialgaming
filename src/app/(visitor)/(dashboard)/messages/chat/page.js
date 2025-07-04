"use client";

import { RHFTextInput } from "@/components/hook-form";
import Loader from "@/components/Loader";
import {
  getChatListAction,
  getMatchRuleAction,
  getRoomChatThreadAction,
  roomChatAction,
  sendChatAction,
  sendRoomChatAction,
} from "@/redux/dashboard/action";
import {
  getChatUserData,
  getData,
  getModelChatData,
  getRoomId,
  setChatUserData,
  setModelChatData,
} from "@/utils/storage";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import moment from "moment";
import { CommonConstant, EmitterKey, SocketKEY } from "@/constants/keywords";
import EventEmitter from "@/components/EventEmitter";
import socket from "@/socket/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const Chat = () => {
  const router = useRouter();
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
    { id: 4, name: "Muscleman", image: "/images/seeds.png" },
  ]);
  var threadIdValue = 0;
  const [chatListPage, setChatListPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [chatList, setChatList] = useState([]);
  const [chatReverseList, setChatReverseList] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [threadList, setThreadList] = useState([]);
  const [isHeader, setIsHeader] = useState(false);
  const [messageTxt, setMessageTxt] = useState("");
  const user = getData("user");
  const roomId = getRoomId("roomId");
  const bottomRef = useRef(null);
  const bottomRef1 = useRef(null);
  const [threadId, setThreadId] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const chatContainerRef = useRef(null);
  const scrollRef = useRef(null); // Ref for the scroll container
  const [chatListIsNext, setChatListIsNext] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const userDataForChat = getChatUserData("chat");
  const chatModelData = getModelChatData("chatId");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  let prevDate, oldDate;
  const [isAtBottom, setIsAtBottom] = useState(false);
  const containerRef = useRef(null);

  const checkIfAtBottom = () => {
    const container = containerRef.current;
    if (container) {
      setIsAtBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight
      );
    }
  };
  useEffect(() => {
    // Code to execute when the page is navigated to

    console.log("Screen is focused");
    CommonConstant.pathName = "chat";
    CommonConstant.isFromHome = false;

    return () => {
      // Code to execute when navigating away from the page
      CommonConstant.pathName = "";
      CommonConstant.notificationCount = 0;
      CommonConstant.isFromHome = true;
      CommonConstant.isFromChat = true;
      console.log("Screen is unfocused");
    };
  }, [router.asPath]); // De
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleScrollToBottom();
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, []);

  const handleScrollToBottom = () => {
    // Your method call when scrolled to the bottom
    console.log("Scrolled to the bottom");
  };

  useEffect(() => {
    if (SocketKEY.socketConnect === null) {
      socket.start();
      socket.subscribeUser();
    }
    //getChatList();
    // getThreadList();
    getUserMessagesEvent();
    return () => {};
  }, []);

  useEffect(() => {
    // if (SocketKEY.socketConnect === null) {
    //   socket.start();
    //   socket.subscribeUser();
    // }
    getChatList();
    return () => {};
  }, [threadId]);

  useEffect(() => {
    if (chatListIsNext) {
      getChatList();
      // GroupTourReadMessage(true);
    }
  }, [chatListPage]);

  useEffect(() => {
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // const container = bottomRef.current?.parentNode;
    // if (container) {
    //   const halfScroll = container.scrollHeight / 10;
    //   container.scrollTo({
    //     top: halfScroll,
    //     behavior: "smooth",
    //   });
    // }
    if (chatListPage == 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      const container = bottomRef.current?.parentNode;
      if (container) {
        const halfScroll = container.scrollHeight / 10;
        container.scrollTo({
          top: halfScroll,
          behavior: "smooth",
        });
      }
    }
    return () => {};
  }, [chatData]);

  function getUserMessagesEvent() {
    EventEmitter.on(EmitterKey.DrawerClick, (msg) => {
      setChatListPage(1);
      setThreadId(msg.id);
      threadIdValue = msg.id;
    });

    EventEmitter.on(EmitterKey.ChatReceive, (msg) => {
      // console.log("msg", msg);
      addMsgDetails(msg.message);
    });
    EventEmitter.on(EmitterKey.ReloadWeb, (msg) => {
      // console.log("Event received:128", msg);
      getChatList();
      // GroupTourReadMessage(true);
    });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file.type.startsWith("video/")) {
      const fileUrl = URL.createObjectURL(file);

      setSelectedVideoUrl(fileUrl);
      setSelectedImageUrl(null);
    } else if (file.type.startsWith("image/")) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      console.log("file 97", file);
      setSelectedImage(file);
      setSelectedVideoUrl(null); // Clear any selected video URL
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageUrl(null);
  };

  const removeSelectedVideo = () => {
    setSelectedVideoUrl(null);
  };

  const getChatList = async () => {
    setIsLoader(true);
    const userDataForChat = getChatUserData("chat");
    const payload = new FormData();
    // console.log("userDataForChat", userDataForChat);
    // console.log("chatModelData", chatModelData);
    payload.append("fromUserId", user.data.id);
    if (chatModelData) {
      payload.append("userId", chatModelData.id);
    } else {
      payload.append(
        "userId",
        userDataForChat.fromUserId === user.data.id
          ? userDataForChat.userId
          : userDataForChat.fromUserId
      );
    }
    payload.append("perPage", 20);
    payload.append("page", chatListPage);
    payload.append("lastChatId", 0);
    payload.append("group_id", 0);
    try {
      const res = await dispatch(getChatListAction(payload));

      setIsLoader(false);

      if (res.payload.status) {
        setChatList(res.payload.data);
        // console.log("res.payload.data.isNextPage", res.payload.data.isNextPage);
        setChatData([...chatData, ...res.payload.data.data]);
        setChatListIsNext(res.payload.data.isNextPage);
        var tempArray = [...chatData, ...res.payload.data.data];
        tempArray = tempArray.reverse();
        setChatReverseList(tempArray);
        // const newObj = [...chatData];
        // const obj = _.cloneDeep(res.payload.data.data);
        // obj.map((item) => {
        //   newObj.push(item);
        // });
        // setChatData(newObj);

        // console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      console.log("Error", error);
    }
  };

  const getThreadList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getRoomChatThreadAction());

      setIsLoader(false);
      console.log("res--> 244", res.payload.data);

      if (res.payload.status) {
        setThreadList(res.payload.data?.data);

        // setChatData([...chatData, ...res.payload.data.data]);
        // setChatListIsNext(res.payload.data.isNextPage);
        // var tempArray = [...chatData, ...res.payload.data.data];
        // tempArray = tempArray.reverse();
        // setChatReverseList(tempArray);

        console.log("res--> 2451", res.payload.data.data);
      } else {
        console.log("res--> 133");
      }
    } catch (error) {
      setIsLoader(false);
      console.log("Error", error);
    }
  };

  const sendChatMessage = async () => {
    try {
      const userDataForChat = getChatUserData("chat");
      const payload = new FormData();

      payload.append("fromUserId", user.data.id);

      if (chatModelData) {
        payload.append("userId", chatModelData.id);
      } else {
        payload.append(
          "userId",
          userDataForChat.fromUserId === user.data.id
            ? userDataForChat.userId
            : userDataForChat.fromUserId
        );
      }
      payload.append("chatType", "individualchat");
      payload.append("group_id", 0);
      /////

      if (selectedImage) {
        payload.append("mediaType", "textimage");
        payload.append("media", selectedImage);
      } else {
        payload.append("mediaType", "text");
        payload.append("media", messageTxt);
      }

      const { payload: res } = await dispatch(sendChatAction(payload));
      console.log("status 137", res);

      const { data, status } = res;

      if (status) {
        setSelectedImageUrl(null);
        setSelectedImage(null);
        addMsgDetails(res.data.result);

        // ✅ Scroll to bottom
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // slight delay ensures new message is rendered
      } else {
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  function addMsgDetails(msg) {
    setMessageTxt("");
    var tempArray = [...chatData, msg];
    tempArray = tempArray.reverse();
    setChatReverseList((oldArray) => [...oldArray, msg]);
    setChatData((oldArray) => [...oldArray, msg]);
  }

  const handleImageClick = (item) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedItem(null);
    setSelectedImageUrl(null);
  };

  function ImagePreview({ item, onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="relative w-4/5 h-4/5 md:w-3/4 md:h-3/4 bg-black25 p-4 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
          >
            ✕
          </button>
          <img
            src={item.messageData}
            alt="Preview Image"
            className="object-contain h-full w-full rounded-lg"
          />
        </div>
      </div>
    );
  }

  function renderReceiverView(item) {
    return (
      <>
        <div class="flex flex-col items-start space-y-2">
          {item.mediaExt === "image" ? (
            <div
              class="bg-black25 p-3 rounded-lg max-w-xs"
              onClick={() => handleImageClick(item)}
            >
              <img
                src={item.mediaContent1}
                alt="Received Image"
                class="rounded-lg max-w-xs"
              />
            </div>
          ) : item.messageType === "video" ? (
            <div
              class="bg-black25 p-3 rounded-lg max-w-xs"
              onClick={() => handleImageClick(item)}
            >
              <video
                src={item.messageData}
                alt="Received Image"
                class="rounded-lg max-w-xs"
              />
            </div>
          ) : (
            <div class="bg-black25 p-3 rounded-lg max-w-xs text-white">
              <p class="text-sm">{item.mediaContent}</p>
            </div>
          )}
          <div class="flex items-center space-x-2">
            <div class="flex justify-center items-center">
              <span class="text-[10px] text-white">
                {item?.senderId?.username}
              </span>
              <span class="text-[10px] text-gray-500 ml-2 text-white">
                {moment.utc(item.createdAt).local().format("hh:mm A")}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderSenderView(item) {
    // console.log("item.", item);
    return (
      <div class="flex flex-col items-end space-y-2">
        {item.mediaExt === "image" ? (
          <div
            class="bg-black25 p-3 rounded-lg max-w-xs"
            onClick={() => handleImageClick(item)}
          >
            <img
              src={item.mediaContent1}
              alt="Sent Image"
              class="rounded-lg max-w-xs"
            />
          </div>
        ) : item.messageType === "video" ? (
          <div
            class="bg-black25 p-3 rounded-lg max-w-xs"
            onClick={() => handleImageClick(item)}
          >
            <video
              src={item.messageData}
              alt="Sent Video"
              class="rounded-lg max-w-xs"
            />
          </div>
        ) : (
          <div class="bg-black25 p-3 rounded-lg max-w-xs text-white">
            <p class="text-sm">{item.mediaContent}</p>
          </div>
        )}
        <div class="flex items-center space-x-2">
          <div class="flex justify-center items-center">
            <span class="text-[10px] text-gray-500 text-white">
              {moment.utc(item.createdAt).local().format("hh:mm A")}
            </span>
            <span class="text-[10px] ml-2 text-white">
              {item?.senderId?.username}
            </span>
          </div>
          {/* <div class="rounded-full h-5 w-5 bg-gray82 flex items-center justify-center">
            <img
              class="rounded-full h-full w-full object-cover"
              src={item?.senderId?.image}
              alt="Sender's Profile Picture"
            />
          </div> */}
        </div>
      </div>
    );
  }

  function dateHeader(res) {
    return (
      <div class="mt-2">
        <span class="text-sm text-gray-400"> {res || oldDate}</span>
      </div>
    );
  }

  const onEndReach = async () => {
    console.log("onEndReach");
  };

  const handleScroll = () => {
    if (scrollRef.current.scrollTop === 0) {
      loadMore();
      // console.log("onEndReach");
    }
  };

  function loadMore() {
    setChatListPage((abovePage) => abovePage + 1);
  }

  return (
    <>
      {/* {console.log("chatModelData", chatModelData)} */}
      {isLoader ? (
        <Loader />
      ) : (
        <div className="flex flex-col h-screen bg-black06 text-white">
          <header className="bg-gray-800 p-4 bg-black06 text-white max-md:fixed top-0 md:left-[16%] right-0 flex items-center justify-between w-full">
            <div className="flex-none p-4 bg-gray-900 rounded-lg w-full">
              <div className="flex items-center space-x-4 justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-white bg-gray-900 p-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <ArrowLeftIcon className="h-6 w-6 text-white" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div className="flex gap-5">
                <div className="rounded-full h-10 w-10 bg-gray82 flex items-center justify-center">
                  <img
                    className="rounded-full h-full w-full object-cover"
                    src={
                      chatModelData
                        ? chatModelData.imgUrl
                        : userDataForChat?.image
                    }
                    alt="User Profile Picture"
                  />
                </div>
                <h1 className="text-xl font-semibold">
                  {chatModelData ? chatModelData.name : userDataForChat?.uName}
                </h1>
                </div>
              </div>
            </div>
          </header>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 mt-24"
            style={{ height: "80vh" }}
          >
            <div className="flex-grow p-4 bg-black06 mb-12">
              {chatReverseList.map((item, index) => {
                let header = false;
                let chatMsgDate = item.createdAt;
                let headerText;
                var yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);

                if (
                  moment.utc(chatMsgDate).local().format("DD-MM-YYYY") ===
                  moment.utc(new Date()).local().format("DD-MM-YYYY")
                ) {
                  headerText = "Today";
                } else if (
                  moment.utc(chatMsgDate).local().format("DD-MM-YYYY") ===
                  moment.utc(yesterdayDate).local().format("DD-MM-YYYY")
                ) {
                  headerText = "Yesterday";
                } else {
                  headerText = moment
                    .utc(chatMsgDate)
                    .local()
                    .format("MM-DD-YYYY");
                }

                if (
                  index === 0 ||
                  (index > 0 && chatData[index - 1]?.createdAt !== chatMsgDate)
                ) {
                  header = true;
                }

                return (
                  <div key={index}>
                    <div className="flex flex-col items-center justify-center p-4"></div>
                    {item?.fromUserId === user.data.id
                      ? renderSenderView(item)
                      : renderReceiverView(item)}
                  </div>
                );
              })}
            </div>
            <div ref={bottomRef} />
          </div>

          <footer className="bg-red text-black25 max-md:fixed bottom-0 md:left-[16%] right-0 w-full">
            {selectedVideoUrl && (
              <div className="relative flex items-center justify-center p-4 bg-black25 rounded-lg mx-4 mb-2">
                <video
                  src={selectedVideoUrl}
                  controls
                  className="rounded-lg max-h-40 object-cover"
                />
                <button
                  onClick={removeSelectedVideo}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {selectedImageUrl && (
              <div className="relative flex items-center justify-center p-4 bg-black25 rounded-lg mx-4 mb-2">
                <img
                  src={selectedImageUrl}
                  alt="Selected Preview"
                  className="rounded-lg max-h-40 object-cover"
                />
                <button
                  onClick={removeSelectedImage}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex-none md:bg-black25 bg-black06">
              <div className="flex items-center space-x-4 p-4 mx-auto">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <img
                    src="/images/cemera.svg"
                    width="25"
                    height="25"
                    alt="Logo"
                  />
                </button>
                <input
                  type="file"
                  name="image"
                  id="fileInput"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }} // Hide the file input
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageTxt}
                  onChange={(event) => setMessageTxt(event.target.value)}
                  className="flex-1 p-2 bg-gray-800 rounded-lg text-black06 focus:outline-none"
                />
                <button
                  onClick={sendChatMessage}
                  className="px-4 py-2 bg-yellow rounded-lg text-black06"
                >
                  Send
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Chat;
