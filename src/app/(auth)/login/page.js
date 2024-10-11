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
        <div className="min-h-screen bg-gradient-to-b from-gray6d to-black06 flex flex-col items-center justify-center p-4 relative">
          {/* <div className="absolute top-4 left-4">
            <Image
              src="/images/logo.png"
              className="logo-img"
              width={45}
              height={45}
            />
          </div> */}

          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-center text-white md:w-full">
                    The First Platform for Gamer Growth.
                  </h1>
                </div>
                <p className="text-lg text-gray82 text-[30px] text-center mt-2">
                  Show the world.
                </p>
              </div>
            </div>

            <div className="bg-black26 rounded-lg p-8">
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={95}
                  height={95}
                />
              </div>

              <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmitForm)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-white"
                  >
                    Email
                  </label>

                  <RHFTextInput
                    name="email"
                    placeholder="Enter your email address "
                    className="w-full px-3 py-2 bg-gray-800 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2 text-white"
                  >
                    Password
                  </label>

                  <RHFTextInput
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-3 py-2 bg-gray-800 rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 w-[160px] transition duration-300 border-white border-[1px] rounded-full mt-4 text-blueF0"
                >
                  Log in
                </button>
              </FormProvider>

              <div className="mt-6 text-center">
                <p className="text-sm text-white">
                  Don't have an account?
                  <button
                    className="ml-2 text-blueF0 hover:underline"
                    onClick={onClickSignUp}
                  >
                    Sign up
                  </button>
                </p>
                <button
                  className="text-sm text-white hover:underline mt-2"
                  onClick={onClickForgetPassWord}
                >
                  Forgot password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
