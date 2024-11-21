"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  createDisputesAction,
  disputesListAction,
  getGameRemainAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { FormProvider } from "@/components/hook-form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import { getData } from "@/utils/storage";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";

const openCase = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
  ]);
  const { toaster } = useToaster();
  const router = useRouter();

  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Opponent cheated");
  const gameSessions = [
    {
      id: 1,
      title: "Warzone 2",
      playedAt: "Aug 14, 2024 03:06",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 2,
      title: "Warzone 2",
      playedAt: "Aug 14, 2024 03:04",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 3,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:43",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 4,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:15",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 5,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:07",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 6,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 04:23",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 7,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 03:59",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 8,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 03:50",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 1,
      title: "Warzone 2",
      playedAt: "Aug 14, 2024 03:06",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 2,
      title: "Warzone 2",
      playedAt: "Aug 14, 2024 03:04",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 3,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:43",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 4,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:15",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 5,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 06:07",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 6,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 04:23",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 7,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 03:59",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
    {
      id: 8,
      title: "Warzone 2",
      playedAt: "Aug 13, 2024 03:50",
      imageUrl:
        "http://52.32.200.186/backend/uploads/game/a1dd4057-8641-47dc-ac1d-76abfa49f116.png",
    },
  ];
  const regardData = [
    {
      value: "Opponent cheated",
      label: "Opponent cheated",
    },
    {
      value: "Opponent didn't follow rules",
      label: `Opponent didn't follow rules`,
    },
    {
      value: "Other",
      label: "Other",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const user = getData("user");
  const [gameHistoryData, setGameHistoryData] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const games = [
    { name: "Warzone 2", playedAt: "Aug 14, 2024 03:06" },
    { name: "Warzone 2", playedAt: "Aug 14, 2024 03:04" },
    { name: "Warzone 2", playedAt: "Aug 13, 2024 06:43" },
    // Add more games here...
  ];
  useEffect(() => {
    getGameRemainAPi();
  }, []);
  useEffect(() => {}, [selectedImages]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
  };

  const getGameRemainAPi = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(getGameRemainAction());

      setIsLoader(false);

      if (res.payload.status) {
        setDisputeList(res.payload.data.data);

        setGameHistoryData(res.payload.data.data);
        setSelectedGame(res.payload.data.data[0]);
      } else {
      }
    } catch (error) {
      setIsLoader(false);
    }
  };
  // Form Config
  const defaultValues = useMemo(
    () => ({
      userName: "",
      email: "",
    }),
    []
  );

  const formSchema = useMemo(() => {
    return yup
      .object()
      .shape({
        userName: yup
          .string()
          .required("Please enter username")
          .trim("Please enter valid username"),
        email: yup
          .string()
          .required("Please enter email address")
          .email("Please enter valid email address")
          .trim("Please enter valid email address"),
        issue: yup
          .string()
          .required("Issue is required")
          .trim("Enter valid Issue"),
      })
      .required()
      .strict(true);
  }, []);

  //Hooks
  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  // Constants
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  //onclick
  // const onSubmitForm = async (formData) => {};

  const onSubmitForm = async (formData) => {
    setIsLoader(true);
    try {
      const { userName, issue, email } = formData;
      const payload = new FormData();
      payload.append("name", userName);
      payload.append("details", issue);
      payload.append("match", selectedGame?.game);
      payload.append("user", user.data.id);
      payload.append("email", email);
      payload.append("match_type", "single");
      payload.append("match_request_id", selectedGame?.matchCommonId);
      payload.append("regarding", selectedOption);
      selectedImages.map((item) => {
        payload.append("image", item);
      });

      // objParam.append("name", name);
      // objParam.append("details", issueDesc);
      // objParam.append("match", gameHistoryData[selectedGame].game);
      // objParam.append("user", Constant.commonConstant.appUser.data.id);
      // objParam.append("email", email);
      // objParam.append(
      //   "match_type",
      //   gameHistoryData[selectedGame].ismultipleuser === 1 ? "multi" : "single"
      // );
      // objParam.append(
      //   "match_request_id",
      //   gameHistoryData[selectedGame].matchCommonId
      // );
      // objParam.append("regarding", regarding);
      // const imageArray = imgArray;
      // imageArray.map((item) => {
      //   objParam.append("image", item);
      // });

      const res = await dispatch(createDisputesAction(payload));

      if (res.payload.status) {
        setIsLoader(false);
        router.back();

        toaster(res.payload.data.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }
    } catch (error) {
      setIsLoader(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ml-[15%] ">
          <div className="bg-black26 text-white rounded-lg p-6 max-w-sm w-full relative">
            <button
              className="  w-[6%] ml-[95%] mt-[2%] mb-[10%]"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Image
                src="/images/close.svg"
                alt="close"
                width={44}
                height={44}
              />
            </button>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {disputeList.length > 0 ? (
                disputeList.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center space-x-4 p-4 bg-gray-300 rounded-lg transition cursor-pointer hover:bg-gray-400 ${
                      selectedGame.id === session.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedGame(session);
                    }}
                  >
                    <img
                      className="rounded-lg h-16 w-16 object-cover"
                      src={session.image}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {session.gamename}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Played at{" "}
                        {moment
                          .utc(session.createdAt)
                          .local()
                          .format("MMM DD, YYYY hh:mm")}
                      </p>
                    </div>
                    {selectedGame.id === session.id && (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <img
                            src="/images/check.svg"
                            width="25"
                            height="25"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No sessions available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoader ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-black06 text-white flex justify-center items-center">
          <div className="w-full max-w-2xl p-12 space-y-8 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <button className="text-gray-400">{/* Back arrow icon */}</button>
              <h2 className="text-2xl font-semibold">Open A Case</h2>
              <div className="text-transparent">
                {/* Placeholder for centering the title */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-base text-center text-gray-400">
              Please fill in the details down below and submit your case. We
              will contact you within 48 hours.
            </p>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(onSubmitForm)}
              className="space-y-6"
            >
              <div>
                <label className="block text-base font-medium text-gray-400">
                  Your Name
                </label>
                <RHFTextInput
                  type="userName"
                  name="userName"
                  placeholder="Enter UserName"
                  className="w-full mt-2 p-4 bg-gray-700 text-black06 rounded-md border border-gray30 focus:outline-none focus:ring-2 focus:ring-yellow"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-400">
                  Email Address
                </label>
                <RHFTextInput
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  className="w-full mt-2 p-4 bg-gray-700 text-black06 rounded-md border border-gray30 focus:outline-none focus:ring-2 focus:ring-yellow"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-400">
                  This Case Regarding for
                </label>
                <select
                  onChange={handleSelectChange}
                  className="w-full mt-2 p-4 bg-gray-700 text-black06 rounded-md border border-gray30 focus:outline-none focus:ring-2 focus:ring-yellow"
                >
                  <option disabled>Select an item</option>
                  {regardData.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-400">
                  Please Select The Game
                </label>
                <div
                  onClick={toggleModal}
                  className="w-full flex items-center p-4 bg-gray-700 text-black06 rounded-md border border-gray30"
                >
                  <img
                    src={selectedGame?.image}
                    alt="Game Image"
                    className="w-12 h-12 rounded-md"
                  />
                  <div className="ml-4 flex flex-col">
                    <span className="font-semibold text-white">
                      {selectedGame?.gamename}
                    </span>
                    <span className="text-sm text-gray82">
                      Played at{" "}
                      {moment
                        .utc(selectedGame?.createdAt)
                        .local()
                        .format("MMM DD, YYYY hh:mm")}
                    </span>
                  </div>
                  <div className="ml-auto">
                    {/* Dropdown icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-400">
                  Explain Your Issue
                </label>
                <RHFTextInput
                  name="issue"
                  type="issue"
                  placeholder="Enter Your Issue"
                  className="w-full mt-2 p-4 bg-gray-700 text-black06 rounded-md border border-gray30 focus:outline-none focus:ring-2 focus:ring-yellow"
                ></RHFTextInput>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-400">
                  Attach Images
                </label>
                <div>
                  <div
                    className="mt-2 w-24 h-24 flex justify-center items-center bg-gray-700 text-gray-400 rounded-md border border-dashed border-gray-600 cursor-pointer"
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>

                  <input
                    id="imageInput"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-yellow text-black06 font-semibold rounded-md hover:bg-yellow"
              >
                Submit My Case
              </button>
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default openCase;
