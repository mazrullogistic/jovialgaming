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
  paypalPlanListAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData, getRoomId, saveData, setDisputeData } from "@/utils/storage";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
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
const AddBalance = () => {
  const [tournamentData, setTournamentData] = useState([]);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
  const [disputeList, setDisputeList] = useState([]);
  const router = useRouter();
  const user = getData("user");
  const [isOpen, setIsOpen] = useState(false);
  const [seasonModel, setSeasonModel] = useState(false); // State for the selected earner
  const [bcModel, setBcModel] = useState(false); // State for the selected earner

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBadgedData, setSelectedBadgedData] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [SeasonId, setSeasonId] = useState();
  const [gameWinLoss, setGameWinLoss] = useState([]);
  const [gameWinTourLoss, setGameTourWinLoss] = useState([]);
  const [gameByConsole, setGameByConsole] = useState([]);
  const [scoreBoardModel, setScoreBoardModel] = useState(false); // State for the selected earner
  const [twModel, setTwModel] = useState(false); // State for the selected earner
  const [fileImg, setFileImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isPayPalBtnShow, setIsPayPalBtnShow] = useState(false);
  const [consoleList, setConsoleList] = useState([]);
  const [planList, setPlanList] = useState([]);

  const [badgesData, setBadgesData] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [fees, setFees] = useState("");
  useEffect(() => {
    console.log("user 68", user.data);
    getPlanList();
  }, []);

  const chargeOnError = (err) => {
    console.log("err", err);

    return (
      window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(JSON.stringify({ status: "Error" }))
    );
  };
  const chargeOnCancel = (err) => {
    console.log("err", err);

    return (
      window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "cancel" })
      )
    );
  };
  const chargeOncatchErr = (err) => {
    console.log("err", err);

    return (
      window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: "cancel" })
      )
    );
  };
  const chargeOnApprove = (data, detail) => {
    // call the backend api to store transaction details
    console.log("data", data);
    cardBalanceAdd();

    return (
      window.ReactNativeWebView &&
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ data: data, status: "sucess 123345" })
      )
    );
  };

  const cardBalanceAdd = async () => {
    setIsLoader(true);
    //    console.log("SeasonId 311", SeasonId);
    const object = {
      amount: selectedAmount,
    };

    try {
      const res = await dispatch(cardPurchaseAction(object));

      console.log("res--> 371", res.payload.data);
      setIsLoader(false);

      if (res.payload.status) {
        toast.success(res.payload.message, TOAST_TYPES.ERROR);
        router.replace("/home");
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

  const getPlanList = async () => {
    setIsLoader(true);

    try {
      const res = await dispatch(paypalPlanListAction());

      console.log("res--> 313", res.payload.data);
      setIsLoader(false);

      if (res.payload.status) {
        // setProfileData(res.payload.data.data);
        // setIsProfileCard(true);
        setSelectedAmount(res.payload.data.data[0].amount);
        setFees(res.payload.data.data[0].charges);
        setPlanList(res.payload.data.data);
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

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <div>
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
                  style={style}
                  disabled={false}
                  forceReRender={[1, currency, style]}
                  fundingSource={undefined}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: currency,
                            value: 1,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(err) => chargeOnApprove(err)}
                  onError={(err) => chargeOnError(err)}
                  catchError={(err) => chargeOncatchErr(err)}
                  onCancel={(err) => chargeOnCancel(err)}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="bg-black06 flex flex-col min-h-screen items-center justify-center">
              <header className="p-4 flex items-center">
                <h1 className="text-2xl font-bold ml-4 text-white">
                  Add Balance
                </h1>
              </header>

              <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-yellow text-6xl mb-4 text-[76px]">
                  ${selectedAmount}
                </div>
                <p className="text-gray6E text-center mb-8">
                  $ {fees} will be collected to compensate fees collected by our
                  payment processors
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {planList.map((amount) => (
                    <button
                      key={amount.amount}
                      onClick={() => {
                        setSelectedAmount(amount.amount);
                        setFees(amount.charges);
                      }}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-[16px] ${
                        selectedAmount === amount.amount
                          ? "bg-yellow text-black06"
                          : "bg-gray6d text-white"
                      }`}
                    >
                      ${amount.amount}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsPayPalBtnShow(true);
                  }}
                  className="bg-yellow text-black06 py-3 px-12 rounded-xl text-[16px]"
                >
                  Deposit
                </button>
              </main>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AddBalance;
