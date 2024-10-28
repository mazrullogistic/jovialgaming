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
          <div className="flex items-center py-4 ">
            <button
              onClick={() => router.back()}
              className="text-white bg-gray-700 p-2 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          <div className="bg-black26 rounded-xl mt-28 h-[90%] w-1/2.5 mx-auto flex flex-col p-12 justify-center items-center">
            <h1 className="text-2xl mb-6">Withdraw</h1>

            <div className="space-y-6 w-full max-w-md">
              <div className="flex justify-between items-center">
                <button className="text-black06 px-6 py-2 rounded"></button>
                <button
                  className="text-yellow"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  {isEditable ? "Save" : "Edit"}
                </button>
              </div>

              <input
                type="text"
                value={paypalId ? paypalId : zelleId}
                onChange={(e) => setPaypalId(e.target.value)}
                disabled={!isEditable}
                className={`w-full ${
                  isEditable
                    ? "bg-gray-700 text-black25"
                    : "bg-gray-800 text-white"
                } py-3 px-4 rounded-full focus:outline-none`}
              />

              <input
                type="text"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800 text-black06 py-3 px-4 rounded-full focus:outline-none"
              />
            </div>

            <div className="space-y-4 w-full max-w-md mt-6">
              <p className="text-center text-gray6E text-sm">
                Please allow 3-10 Business days for earnings to reach the form
                of withdrawal.
              </p>
              <button
                onClick={withDrawAmountApi}
                className="w-[40%] bg-yellow text-black06 py-3 rounded-full mx-auto ml-[30%]"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawBalance;
