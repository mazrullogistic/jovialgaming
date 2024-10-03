"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FormProvider, RHFTextInput } from "@/components/hook-form";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useToaster from "@/hooks/useToaster";

const Withdraw = () => {
  const [tournamentData, setTournamentData] = useState([
    { image: "/images/photo.jpg" },
    { image: "/images/photo1.jpg" },
    { image: "/images/photo2.jpg" },
    { image: "/images/photo3.jpg" },
    { image: "/images/photo4.jpg" },
    { image: "/images/photo.jpg" },
    { image: "/images/photo1.jpg" },
    { image: "/images/photo2.jpg" },
    { image: "/images/photo3.jpg" },
    { image: "/images/photo4.jpg" },
  ]);
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
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
  const onSubmitForm = () => {};

  return (
    <div className="h-screen bg-black06  ">
      <div className="h-[80%] w-[40%] bg-gray33 rounded-xl ml-[30%]  ">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
          <div className="center-container">
            <div>
              <p className="textInput-txt">Withdraw</p>
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
                <p className="textInput-txt-blue ml-2 cursor-pointer">
                  Sign up
                </p>
              </div>
              <div className="center-container mt-4">
                <a className="textInput-txt cursor-pointer">Forgot password</a>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default Withdraw;
