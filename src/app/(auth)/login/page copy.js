"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { API_ROUTER } from "@/services/apiRouter";
import { toast } from "react-toastify";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import useToaster from "@/hooks/useToaster";
import { FormProvider, RHFTextInput } from "@/components/hook-form";
import { axiosPost } from "@/services/axiosHelper";
import Link from "next/link";
import { loginAction, registerAction } from "@/redux/Auth/action";
import { useDispatch, useSelector } from "react-redux";
import { setIsForgotPassword } from "@/redux/Auth/AuthSlice";
import { useRouter } from "next/navigation";
import { getData, setRoomData, setRoomID } from "@/utils/storage";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import Loader from "@/components/Loader";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = getData("user");
  const userAuth = user?.token;
  const { toaster } = useToaster();
  const [isLoading, setIsLoading] = useState(false);

  // Form Config
  const defaultValues = useMemo(
    () => ({
      email: "jayeshrathod@logisticinfotech.co.in",
      password: "12345",
    }),
    []
  );

  const formSchema = useMemo(() => {
    return yup

      .object()
      .shape({
        email: yup
          .string()
          .required("Please enter email address")
          .email("Please enter valid email address")
          .trim("Please enter valid email address"),
        password: yup
          .string()
          .required("Password is required")
          .trim("Enter valid password"),
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
  const onSubmitForm = async (formData) => {
    setIsLoading(true);
    try {
      const { email, password } = formData;
      const payload = new FormData();
      payload.append("email", email);
      payload.append("password", password);

      const res = await dispatch(loginAction(payload));

      console.log("res-->", res.payload.status);
      console.log("res?.data?.roomId-->", res?.payload?.data?.roomId);

      if (res.payload.status) {
        // setIsLoading(false);
        if (res?.payload?.data?.roomId) {
          setRoomID("roomId", res?.payload?.data?.roomId);
          setRoomData("roomData", res?.payload?.roomDetails);

          router.replace(PATH_DASHBOARD.home);
        } else {
          router.replace(PATH_DASHBOARD.chooseRoom);
        }

        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      } else {
        setIsLoading(false);
        console.log("res--> 133");

        toaster(res.payload.message, TOAST_TYPES.ERROR);
      }

      // const res = await dispatch(
      //   loginAction({
      //     email: "litip@mailinator.com",
      //     password: "Admin@123",
      //     otp: 870213,
      //   })
      // );
      console.log("res", res);
      // console.log("res", res.payload.status);
      // if (!res.payload.status) {
      //   return toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      // }
      // if (res.payload.status) {
      //   toaster(TOAST_ALERTS.LOGIN_SUCCESS, TOAST_TYPES.SUCCESS);
      //   methods.reset();
      //   router.push("/que1");
      // }
    } catch (error) {
      setIsLoading(false);

      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  //const onSubmitForm = () => {};
  const onClickSignUp = () => {
    router.push(PATH_AUTH.signup);
  };

  const onClickForgetPassWord = () => {
    router.push(PATH_AUTH.forgotPassword);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main-container">
          <Image
            src="/images/logo.png"
            className="logo-img"
            width={45}
            height={45}
          />
          <p className="header-txt">
            The First Platform for Gamer
            <br /> Growth.
          </p>
          <p className="header-sub-txt">Show the world.</p>
          <div className="center-container">
            <div className="box-container">
              <div className="center-container">
                <Image
                  src="/images/logo.png"
                  width={95}
                  height={95}
                  className="box-container-img"
                />
              </div>
              <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmitForm)}
                className="mt-[20px] mb-[40px]"
              >
                <div className="center-container">
                  <div>
                    <p className="textInput-txt">Email</p>
                    <RHFTextInput
                      name="email"
                      placeholder="Enter your email address "
                      className="textInput"
                    />
                  </div>
                </div>
                <div className="center-container">
                  <div>
                    <p className="textInput-txt">Password</p>
                    <RHFTextInput
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="textInput"
                    />
                    <div className="center-container">
                      <button className="btn-login">Log in</button>
                    </div>
                    <div className="center-container mt-8">
                      <p className="textInput-txt">Don't have an account?</p>
                      <p
                        className="textInput-txt-blue ml-2 cursor-pointer"
                        onClick={onClickSignUp}
                      >
                        Sign up
                      </p>
                    </div>
                    <div className="center-container mt-4">
                      <a
                        className="textInput-txt cursor-pointer"
                        onClick={onClickForgetPassWord}
                      >
                        Forgot password
                      </a>
                    </div>
                  </div>
                </div>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
