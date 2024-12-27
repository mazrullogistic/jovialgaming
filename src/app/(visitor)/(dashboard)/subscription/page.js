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

  const [isMobileView, setIsMobileView] = useState(false);

  // Detect if the screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
  const plans = [
    {
      name: "FREE PLAY",
      price: "$6.99/month",
      features: [
        { name: "Free Play", included: true },
        { name: "Priority Updates", included: false },
        { name: "Priority Support", included: false },
      ],
    },
    {
      name: "FREE PLAY PLUS",
      price: "$14.99/month",
      features: [
        { name: "Free Play", included: true },
        { name: "Priority Updates", included: true },
        { name: "Priority Support", included: true },
      ],
    },
    {
      name: "FREE PLAY",
      price: "$149.99/Year",
      features: [
        { name: "Free Play", included: true },
        { name: "Priority Updates", included: true },
        { name: "Priority Support", included: true },
      ],
    },
  ];
  const [currentPlan, setCurrentPlan] = useState(1);

  const prevPlan = () => {
    setCurrentPlan((prev) => (prev > 0 ? prev - 1 : planList.length - 1));
  };

  const nextPlan = () => {
    setCurrentPlan((prev) => (prev < planList.length - 1 ? prev + 1 : 0));
  };

  const images = [
    "https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  ];
  const texts = [
    "Appending currency sign to a purchase form in your e-commerce site using plain JavaScript.",
    "Fixing CSS load order/style.chunk.css incorrect in Nextjs",
    "React Carousel with Server Side Rendering Support – Part 1",
    "React Carousel with Server Side Rendering Support – Part 2",
    "Flutter Xcode couldn’t find any iOS App Development provisioning profiles",
  ];
  const fakerData = Array(12)
    .fill(0)
    .map((item, index) => {
      return {
        image: images[index],
        headline: "w3js -> web front-end studio",
        description: texts[index] || texts[0],
      };
    });
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  useEffect(() => {
    getPlanList();
    getPlanDetail();
  }, []);
  useEffect(() => {
    if (paypalDetail) {
      PlanPurchaseApi();
    }
  }, [paypalDetail]);
  useEffect(() => {
    console.log("selectedPlanId", selectedPlanId);
  }, [selectedPlanId]);

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
        window.history.back();
        toast.success("Already Subscribed", TOAST_TYPES.ERROR);
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
          {isMobileView ? (
            <div className="flex flex-col items-center min-h-screen bg-black06 p-4">
              <div className="flex flex-col space-y-4">
                {planList.map((plan, index) => (
                  <div key={index} className="bg-gray6E p-4 rounded-md">
                    <img
                      src={
                        index === 0
                          ? "/images/plan1.png"
                          : index === 1
                          ? "/images/plan2.png"
                          : "/images/plan3.png"
                      }
                      alt={`Plan ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setSelectedPlaId(plan.planId);
                        setIsPayPalBtnShow(true);
                      }}
                      className="mt-4 bg-yellow text-black26 py-2 px-4 rounded-full w-full"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black06 p-4">
              <div className="relative w-full">
                <div className="flex overflow-hidden">
                  {planList.map((plan, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-full md:w-1/3 text-white overflow-hidden transition-all duration-300 ease-in-out transform ${
                        index === currentPlan
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-70"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedPlan(planList[currentPlan]);
                          setSelectedPlaId(planList[currentPlan].planId);
                          console.log("current Plan", planList[currentPlan]);
                          if (index === currentPlan) {
                            setIsPayPalBtnShow(true);
                          }
                        }}
                        className="hover:bg-yellow absolute mt-[85%] bg-yellow text-black26 py-2 px-4 rounded-full w-[45%] ml-[30%]"
                      >
                        Subscribe
                      </button>
                      <img
                        draggable={false}
                        src={
                          index === 0
                            ? "/images/plan1.png"
                            : index === 1
                            ? "/images/plan2.png"
                            : "/images/plan3.png"
                        }
                        alt={`Plan ${index + 1}`}
                      ></img>
                    </div>
                  ))}
                </div>
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-white bg-black06 bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                  onClick={prevPlan}
                >
                  <img
                    src="/images/previousArrow.svg"
                    alt="Previous"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-white bg-black06 bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                  onClick={nextPlan}
                >
                  <img
                    src="/images/nextArrow.svg"
                    alt="Next"
                    className="w-6 h-6"
                  />
                </button>
              </div>
              <div className="flex mt-4 space-x-2">
                {plans.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentPlan ? "bg-white" : "bg-gray82"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscription;
