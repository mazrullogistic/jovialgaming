"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  addSubscriptionDataAction,
  disputesListAction,
  getBadgesListAction,
  getGameHistoryAction,
  getPlanDetailAction,
  getSeasonListAction,
  getSubscriptionDetailAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData } from "@/utils/storage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowLeft, ChevronDown, Edit2, Plus, Minus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";

const Subscription = () => {
  const [tournamentData, setTournamentData] = useState([
    { id: 1, name: "Juswoo", image: "/images/seeds.png" },
    { id: 2, name: "Quancinco", image: "/images/seeds.png" },
    { id: 3, name: "Vonwill", image: "/images/seeds.png" },
  ]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [badgeList, setBadgeList] = useState([]);
  const user = getData("user");
  const [badgesSelect, setBadgesSelect] = useState(0);
  const [seasonModel, setSeasonModel] = useState(false);
  const [gameHistoryModel, setGameHistoryModel] = useState(false);
  const [seasonList, setSeasonList] = useState([]);
  const [gameHistoryList, setGameHistoryList] = useState([]);
  const [SeasonId, setSeasonId] = useState();
  const [SeasonName, setSeasonName] = useState();
  const [isSelectGame, setIsSelectGame] = useState(0);
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPlanId, setSelectedPlaId] = useState("");
  const [isPayPalBtnShow, setIsPayPalBtnShow] = useState(false);
  const [paypalDetail, setPaypalDetail] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
    getPlanList();
    getPlanDetail();
  }, []);
  useEffect(() => {
    if (paypalDetail) {
      PlanPurchaseApi();
    }
  }, [paypalDetail]);
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
  const getNextDayDate = () => {
    const today = new Date(); // Get the current date
    const nextDay = new Date(today); // Copy the current date
    nextDay.setDate(today.getDate() + 1); // Add one day to the date
    return nextDay;
  };
  const getNextMonthDate = () => {
    const today = new Date(); // Get the current date
    const nextMonth = new Date(today); // Copy the current date
    nextMonth.setMonth(today.getMonth() + 1); // Add one month to the date
    return nextMonth;
  };
  const getNextYearDate = () => {
    const today = new Date(); // Get the current date
    const nextYear = new Date(today); // Copy the current date
    nextYear.setFullYear(today.getFullYear() + 1); // Add one year to the date
    return nextYear;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now;
  };

  console.log(
    moment.utc(getCurrentDateTime()).local().format("DD-MM-YYYY hh:mm")
  );
  console.log(moment.utc(getNextDayDate()).local().format("DD-MM-YYYY hh:mm"));
  console.log(
    moment.utc(getNextMonthDate()).local().format("DD-MM-YYYY hh:mm")
  );
  console.log(moment.utc(getNextYearDate()).local().format("DD-MM-YYYY hh:mm"));

  const handleSelect = (option, index) => {
    setSelectedIndex(index);
    setSelectedPlan(option);
    setSelectedPlaId(option.planId);
  };

  const getPlanList = async () => {
    setIsLoader(true);
    //    console.log("SeasonId 311", SeasonId);

    try {
      const res = await dispatch(getPlanDetailAction());

      console.log("res--> 371", res.payload.data);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setPlanList(res.payload.data.data);
        setSelectedPlan(res.payload.data.data[0]);
        setSelectedPlaId(res.payload.data.data[0].planId);
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
  const getPlanDetail = async () => {
    setIsLoader(true);
    //    console.log("SeasonId 311", SeasonId);

    try {
      const res = await dispatch(getSubscriptionDetailAction());

      console.log("res--> 93", res.payload.data);

      if (res.payload.status) {
        setSubscriptionDetails(res.payload.data);
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

  const PlanPurchaseApi = async () => {
    setIsLoader(true);
    var endDate =
      selectedPlan.type == "daily"
        ? moment.utc(getNextDayDate()).local().format("DD-MM-YYYY hh:mm")
        : selectedPlan.type == "monthly"
        ? moment.utc(getNextMonthDate()).local().format("DD-MM-YYYY hh:mm")
        : selectedPlan.type == "yearly"
        ? moment.utc(getNextYearDate()).local().format("DD-MM-YYYY hh:mm")
        : moment.utc(getNextMonthDate()).local().format("DD-MM-YYYY hh:mm");

    const payload = new FormData();

    payload.append("userid", user.data.id);
    payload.append("subscriptionID", paypalDetail.subscriptionID);
    payload.append("orderID", paypalDetail.orderID);
    payload.append(
      "facilitatorAccessToken",
      paypalDetail.facilitatorAccessToken
    );
    payload.append(
      "startdate",
      moment.utc(getCurrentDateTime()).local().format("DD-MM-YYYY hh:mm")
    );
    payload.append("enddate", endDate);
    payload.append("amount", selectedPlan.amount);
    payload.append("issubscribe", 1);

    try {
      const res = await dispatch(addSubscriptionDataAction(payload));
      if (res.payload.status) {
        setIsLoader(false);
        console.log("res--> 133");
        window.history.back();
        toast.success("Plan purchase successfully", TOAST_TYPES.SUCCESS);
      } else {
        setIsLoader(false);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
      // setIsLoading(false);
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
      //   setIsLoading(false);
    }
  };
  return (
    <div className="bg-black06 text-white min-h-screen p-4">
      {/* Header */}
      {isPayPalBtnShow ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "relative", // Added relative positioning to the container
          }}
          className="bg-black06"
        >
          {/* Back Button */}

          <button
            onClick={() => {
              setIsPayPalBtnShow(false);
            }}
            className="mb-6 p-2 bg-gray6E rounded-lg"
            style={{
              position: "absolute", // Positioning the button absolutely inside the parent container
              top: "20px", // Adjust the top distance
              left: "20px", // Adjust the left distance
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "white", // Change text color to match the design
            }}
          >
            <ArrowLeft size={24} />
          </button>

          <PayPalScriptProvider
            options={{
              "client-id": process.env.CLIENT_ID,
              components: "buttons",
              currency: "USD",
              vault: true,
            }}
          >
            <PayPalButtons
              createSubscription={(data, actions) => {
                return actions.subscription.create({
                  plan_id: selectedPlanId, // Replace with your PayPal subscription plan ID
                });
              }}
              onApprove={(data, actions) => {
                console.log("Subscription completed:", data);
                console.log("actions completed:", actions);
                setPaypalDetail(data);
                // Handle subscription success, save the subscription ID (data.subscriptionID)
              }}
              onError={(err) => {
                console.error("PayPal Subscription Error", err);
              }}
            />
          </PayPalScriptProvider>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center bg-red">
            <button className=" p-2 rounded-md"></button>
            <h1 className="text-2xl">Payment</h1>
            <div></div> {/* Placeholder for alignment */}
          </div>
          {/* Subscription Section */}
          {/* {planList.map((option, index) => (
                <div
                  key={option.id}
                  className={`text-center p-4 cursor-pointer ${
                    selectedPlan === option
                      ? "border-2 border-white rounded-md"
                      : ""
                  }`}
                  onClick={() => handleSelect(option, index)}
                >
                  <span className="block text-sm">
                    ${option.amount}/{option.type}
                  </span>
                </div>
              ))} */}
          {/* <div className="text-center border-2 border-gray82 px-4 py-2 rounded-md">
            <span className="block text-sm">$14.99/month</span>
          </div>
           */}
          <div className="subscription-small-carousel  w-screen">
            {planList.length > 0 ? (
              <Carousel
                responsive={responsive}
                ssr
                showDots
                infinite
                containerClass="container-with-dots"
                itemClass="image-item"
              >
                {planList.map((post) => {
                  return (
                    <div>
                      <img
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                        src={"/images/plan1.png"}
                      ></img>
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              <p className="avl-txt">No data Found</p>
            )}
          </div>
          {/* <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✔</span> Free Play
              </li>
              {!selectedIndex == 0 && (
                <li className="flex items-center">
                  <span className="mr-2">✔</span> Priority Support
                </li>
              )}
              {!selectedIndex == 0 && (
                <li className="flex items-center">
                  <span className="mr-2">✔</span> Priority Updates
                </li>
              )}
            </ul> */}
        </div>
      )}
    </div>
  );
};

export default Subscription;
