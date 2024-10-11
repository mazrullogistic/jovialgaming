"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
  cardPurchaseAction,
  disputesListAction,
  getBadgesAction,
  getBadgesDataAction,
  getConsoleAction,
  getGameByConsoleAction,
  getGameWinLossAction,
  getProfileCardAction,
  getRoomList,
  getSearchBadgesAction,
  getSeasonListAction,
  getWithdrawAmountAction,
  paypalPlanListAction,
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
  getPaymentData,
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
import Script from "next/script";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";

const currency = "USD";
const style = { layout: "vertical" };
const WithdrawBalance = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const router = useRouter();
  const user = getData("user");
  const paymentData = getPaymentData("payment");

  const [selectedAmount, setSelectedAmount] = useState("");
  // const [paypalId, setPaypalId] = useState("9898998952");
  const [amount, setAmount] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const [paypalId, setPaypalId] = useState(paymentData?.data?.paypalData || "");
  const [zelleId, setZelleId] = useState(paymentData?.data?.zelleData || "");
  const [cashAppID, setCashAppId] = useState(
    paymentData?.data?.cashappData || ""
  );
  useEffect(() => {
    console.log("CommonConstant.isPaymentDetail 68", paymentData?.data);
  }, []);
  useEffect(() => {
    if (!isEditable) {
      updateProfileApi();
    }
  }, [isEditable]);

  const updateProfileApi = async () => {
    setIsLoader(true);

    try {
      const payload = new FormData();
      payload.append("id", user.data.id);
      payload.append("paypal_id", paypalId);
      payload.append("ptype", "paypal");
      const { payload: res } = await dispatch(updateProfileAction(payload));
      console.log("status 137", res);

      const { data, status } = res;
      setIsLoader(false);

      if (status) {
        CommonConstant.isPaymentDetail = res.payload;
        setPaypalId(res.payload.data?.paypalData);
        setPaymentData("payment", res.payload.data);
      } else {
      }
    } catch (error) {
      setIsLoader(false);

      console.log("Error", error);
    }
  };
  const withDrawAmountApi = async () => {
    if (!amount) {
      toast.error("Please Enter Amount");
    }
    setIsLoader(true);
    if (amount <= paymentData?.data?.balance) {
      try {
        const payload = new FormData();
        payload.append("user_id", user.data.id);
        payload.append("paypal_id", paypalId);
        payload.append("ptype", "paypal");
        payload.append("amount", amount);
        const { payload: res } = await dispatch(
          getWithdrawAmountAction(payload)
        );
        console.log("status 137", res);

        const { data, status } = res;
        setIsLoader(false);

        if (status) {
          // setTimeout(() => {
          //   router.replace("/home");
          // }, 2000);
          router.replace("/home");

          // window.history.back();
          // toast.success(res.payload.message);
        } else {
          //  toast.error(res.payload.message);
        }
      } catch (error) {
        setIsLoader(false);

        console.log("Error", error);
      }
    } else {
      toast.error("You cannot withdraw a larger amount from your balance");
    }
  };

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-black06 flex flex-col text-white px-4">
          {/* Header */}
          <div className="flex items-center py-4 ">
            <button
              onClick={() => router.back()}
              className="text-white bg-gray-700 p-2 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold mx-auto">Withdraw</h1>
          </div>

          {/* Form */}
          <div className="space-y-6 pt-52 w-[60%] justify-center self-center">
            {/* PayPal Section */}
            <div className="flex justify-between items-center">
              <button className="bg-yellow text-black06 px-6 py-2 rounded-full">
                PayPal
              </button>
              <button
                className="text-yellow"
                onClick={() => setIsEditable(!isEditable)} // Toggle the input editable state
              >
                {isEditable ? "Save" : "Edit"}
              </button>
            </div>

            {/* PayPal ID Input */}
            <input
              type="text"
              // value={paypalId}
              value={paypalId ? paypalId : zelleId}
              onChange={(e) => setPaypalId(e.target.value)} // Update PayPal ID on change
              disabled={!isEditable} // Make input editable or disabled based on state
              className={`w-full ${
                isEditable
                  ? "bg-gray-700 text-black25"
                  : "bg-gray-800 text-white"
              } py-3 px-4 rounded-lg focus:outline-none`}
            />

            {/* Amount Input */}
            <input
              type="text"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 text-black06 py-3 px-4 rounded-lg focus:outline-none"
            />
          </div>

          {/* Withdraw Button and Info */}
          <div className="space-y-4 w-[60%] self-center">
            <p className="text-center text-gray6E text-sm pt-6">
              Please allow 3-10 Business days for earnings to reach the form of
              withdrawal.
            </p>
            <button
              onClick={withDrawAmountApi}
              className="w-full bg-yellow text-black06 py-3 rounded-full"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawBalance;
