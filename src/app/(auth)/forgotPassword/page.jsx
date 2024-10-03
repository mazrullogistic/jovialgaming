"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { FormProvider, RHFTextInput } from "@/components/hook-form";
import { useForm } from "react-hook-form";
import { forgotPasswordAction } from "@/redux/Auth/action";

const ForgotPassword = () => {
  const selector = useSelector((state) => state.registerApi);
  const router = useRouter();

  //   useEffect(() => {
  //     if (!selector.isForgotPassword) {
  //       router.replace("/login");
  //     }

  //   }, [selector.isForgotPassword]);
  //Hooks

  // Form Config
  const defaultValues = useMemo(
    () => ({
      email: "",
      password: "",
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
      })
      .required()
      .strict(true);
  }, []);
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

  const onSubmitForm = async (formData) => {
    try {
      const { email } = formData;

      const res = await dispatch(
        forgotPasswordAction({
          email,
        })
      );
      //   const res = await axiosPost(API_ROUTER.LOGIN, {
      //     is_google_login: 0,
      //     email,
      //     password,
      //   });

      console.log("res", res);
      if (!res.payload.status) {
        return toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      }
      if (res.payload.status) {
        toaster(TOAST_ALERTS.LOGIN_SUCCESS, TOAST_TYPES.SUCCESS);
        methods.reset();
        router.push("/que1");
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
      console.log("Error", error);
    }
  };

  return (
    <>
      {/* {selector.isForgotPassword ? ( */}
      <div className="container pt-[20px] ">
        <div className="profile-question-main">
          <div className="grid grid-cols-1 grid-div gap-52">
            <div className="right-div-login">
              <div className="profile-question-text-div">
                <p className="started-div text-welcome">Enter Your Email</p>
                <Image
                  src="/images/get-started-bar.svg"
                  className="get-started-bar"
                  width={200}
                  height={5}
                />
                <div className="flex justify-center pt-[50px] md:pt-[147px]">
                  <span className="text-question ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    seddo eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </span>
                </div>
              </div>
            </div>
            <div className="left-div flex justify-end">
              <div className="bg-[#64FFDA29] bg-opacity-[16%] w-[600px] mt-[-166px]">
                <div className="px-[24px] py-[24px] md:px-[50px] md:py-[63px]">
                  <p className="text-center sign-in-title">Forgot Password</p>
                  <FormProvider
                    methods={methods}
                    onSubmit={handleSubmit(onSubmitForm)}
                    className="mt-[80px]"
                  >
                    <div className="mt-10">
                      <RHFTextInput
                        name="email"
                        className="input-tag input-text"
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="mt-[100px] flex items-center flex-col lg:flex-row">
                      <div className="flex w-full h-full justify-start">
                        <button className="w-[160px] h-[60px] rounded-xl text-center text-login-button bg-[#054141]">
                          Submit
                        </button>
                      </div>
                      <Link
                        href="/login"
                        className="flex w-full h-full justify-end text-forget-password mt-[-146px] lg:mt-0"
                      >
                        Go To Login
                      </Link>
                    </div>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ) : (
        <Loader />
      )} */}
    </>
  );
};

export default ForgotPassword;
