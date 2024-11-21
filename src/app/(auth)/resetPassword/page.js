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
import {
  forgotAction,
  loginAction,
  registerAction,
  resetPasswordAction,
  updatePasswordAction,
  verifyForgetPasswordAction,
} from "@/redux/Auth/action";
import { useDispatch, useSelector } from "react-redux";
import { setIsForgotPassword } from "@/redux/Auth/AuthSlice";
import { Router } from "next/router";
import { getData } from "@/utils/storage";
import { PATH_AUTH } from "@/routes/paths";
import { Wizard, useWizard } from "react-use-wizard";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const user = getData("user");
  const userAuth = user?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState("");
  const route = useRouter();

  // Form Config
  const defaultValues = useMemo(
    () => ({
      email: "m@gmail.com",
      password: "M@zrul123",
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
          .trim("Enter valid password")
          .min(8, "Password is too short - should be at least 8 characters")
          .max(16, "Password is too long - should be at most 16 characters")
          .matches(
            /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
            "Password must contain at least one capital letter, alphabets & numbers"
          ),
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

  const { toaster } = useToaster();

  const onSubmitForm = () => {
    router.push(PATH_AUTH.login);
  };

  const onClickForgetPassWord = () => {
    router.push(PATH_AUTH.forgotPassword);
  };

  //Email Methods
  const onSubmitFormEmail = async (formData, nextStep) => {
    const { email } = formData;
    setEmail(email);
    setIsLoading(true);

    const payload = new FormData();
    payload.append("email", email);

    try {
      const res = await dispatch(forgotAction(payload));
      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(0);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(1);
        setIsLoading(false);
        // toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
      // setIsLoading(false);
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      //   setIsLoading(false);
    }
  };
  const defaultValuesEmail = useMemo(
    () => ({
      email: "",
    }),
    []
  );
  const formSchemaEmail = useMemo(() => {
    return yup
      .object()
      .shape({
        email: yup
          .string()
          .required("Please enter email address")
          .email("Please enter valid email address")
          .trim("Please enter valid email address")
          .matches(
            /^($)|(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
            "Please enter a valid email address"
          ),
      })
      .required()
      .strict(true);
  }, []);
  const methodsEmail = useForm({
    resolver: yupResolver(formSchemaEmail),
    defaultValuesEmail,
  });

  //Verification Code Methods
  const onSubmitFormVerificationCode = async (formData, nextStep) => {
    const { verificationCode } = formData;
    setIsLoading(true);

    const payload = new FormData();
    payload.append("email", email);
    payload.append("verificationCode", verificationCode);

    try {
      const res = await dispatch(verifyForgetPasswordAction(payload));
      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(1);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(2);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
      // setIsLoading(false);
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      //   setIsLoading(false);
    }
  };
  const defaultValuesVerificationCode = useMemo(
    () => ({
      verificationCode: "",
    }),
    []
  );
  const formSchemaVerificationCode = useMemo(() => {
    return yup
      .object()
      .shape({
        verificationCode: yup
          .string()

          .matches(/^\d{4}$/, "OTP Must Be Exactly 4 Digits")
          .required("OTP Is Required"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsVerificationCode = useForm({
    resolver: yupResolver(formSchemaVerificationCode),
    defaultValuesVerificationCode,
  });

  //Password Methods
  const onSubmitFormPassword = async (formData, nextStep) => {
    const { password } = formData;
    setIsLoading(true);

    const payload = new FormData();
    payload.append("email", email);
    payload.append("password", password);

    try {
      const res = await dispatch(updatePasswordAction(payload));
      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(2);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        route.replace("/login");

        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesPassword = useMemo(
    () => ({
      verificationCode: "",
    }),
    []
  );
  const formSchemaPassword = useMemo(() => {
    return yup
      .object()
      .shape({
        password: yup
          .string()
          .required("Password Is Required")
          .trim("Enter Valid Password")
          .min(8, "Password is too short - should be at least 8 characters")
          .max(16, "Password is too long - should be at most 16 characters")
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
            "Password must contain alphabets, numbers, and special characters"
          ),
        confirmPassword: yup
          .string()
          .required("Confirm password is required")
          .trim()
          .oneOf([yup.ref("password")], "Passwords must match"),
      })
      .strict(true);
  }, []);
  const methodsPassword = useForm({
    resolver: yupResolver(formSchemaPassword),
    defaultValuesPassword,
  });

  const Step1 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    const {
      handleSubmit: handleSubmitEmail,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsEmail;

    return (
      <>
        <div className="bg-black26 rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/images/logo.png" alt="Logo" width={95} height={95} />
          </div>

          <FormProvider
            methods={methodsEmail}
            onSubmit={handleSubmitEmail((formData) =>
              onSubmitFormEmail(formData, nextStep)
            )}
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

            <button
              type="submit"
              className="w-full py-2 w-[160px] transition duration-300 border-white border-[1px] rounded-full mt-4 text-blueF0"
            >
              Submit
            </button>
          </FormProvider>
        </div>

        {/* <FormProvider
          methods={methodsEmail}
          onSubmit={handleSubmitEmail((formData) =>
            onSubmitFormEmail(formData, nextStep)
          )}
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
              <div className="center-container">
                <button className="btn-next">Submit</button>
              </div>
            </div>
          </div>
        </FormProvider> */}
      </>
    );
  };

  function Step2() {
    const { handleStep, previousStep, nextStep } = useWizard();
    const {
      handleSubmit: handleSubmitVerificationCode,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsVerificationCode;

    return (
      <>
        <div className="bg-black26 rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/images/logo.png" alt="Logo" width={95} height={95} />
          </div>

          <FormProvider
            methods={methodsVerificationCode}
            onSubmit={handleSubmitVerificationCode((formData) =>
              onSubmitFormVerificationCode(formData, nextStep)
            )}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-white"
              >
                Enter Verification Code
              </label>

              <RHFTextInput
                name="verificationCode"
                placeholder="Verification Code"
                className="w-full px-3 py-2 bg-gray-800 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 w-[160px] transition duration-300 border-white border-[1px] rounded-full mt-4 text-blueF0"
            >
              Verify
            </button>
          </FormProvider>
        </div>

        {/* <FormProvider
          methods={methodsVerificationCode}
          onSubmit={handleSubmitVerificationCode((formData) =>
            onSubmitFormVerificationCode(formData, nextStep)
          )}
          className="mt-[20px] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt">Enter Verification Code</p>
              <RHFTextInput
                name="verificationCode"
                placeholder="Verification Code"
                className="textInput"
              />
            </div>
          </div>
          <div className="center-container">
            <div>
              <div className="center-container">
                <button className="btn-next" o>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </FormProvider> */}
      </>
    );
  }

  function Step3() {
    const { handleStep, previousStep, nextStep } = useWizard();
    const {
      handleSubmit: handleSubmitPassword,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsPassword;
    return (
      <>
        <div className="bg-black26 rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/images/logo.png" alt="Logo" width={95} height={95} />
          </div>

          <FormProvider
            methods={methodsPassword}
            onSubmit={handleSubmitPassword((formData) =>
              onSubmitFormPassword(formData, nextStep)
            )}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-white"
              >
                Confirm Password
              </label>

              <RHFTextInput
                name="password"
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 bg-gray-800 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-white"
              >
                Confirm Password
              </label>

              <RHFTextInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 bg-gray-800 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 w-[160px] transition duration-300 border-white border-[1px] rounded-full mt-4 text-blueF0"
            >
              Change Password
            </button>
          </FormProvider>
        </div>
        {/* 
        <FormProvider
          methods={methodsPassword}
          onSubmit={handleSubmitPassword((formData) =>
            onSubmitFormPassword(formData, nextStep)
          )}
          className="mt-[20px] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt">New Password</p>
              <RHFTextInput
                name="password"
                type="password"
                placeholder="New Password"
                className="textInput"
              />
            </div>
          </div>
          <div className="center-container">
            <div>
              <p className="textInput-txt">Confirm Password</p>
              <RHFTextInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="textInput"
              />
            </div>
          </div>
          <div className="center-container">
            <div>
              <div className="center-container">
                <button className="btn-next">Change Password</button>
              </div>
            </div>
          </div>
        </FormProvider> */}
      </>
    );
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        /* <div className="main-container">
          <Image
            src="/images/logo.png"
            className="logo-img"
            width={45}
            height={45}
          />
          <p className="header-txt">The First Platform for Gamer Growth.</p>
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
              <Wizard startIndex={activeIndex}>
                <Step1 />
                <Step2 />
                <Step3 />
              </Wizard>
            </div>
          </div>
        </div> */

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
            <Wizard startIndex={activeIndex}>
              <Step1 />
              <Step2 />
              <Step3 />
            </Wizard>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
