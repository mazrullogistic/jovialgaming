"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { API_ROUTER } from "@/services/apiRouter";
import { axiosPost } from "@/services/axiosHelper";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TOAST_ALERTS, TOAST_TYPES, S3KEY } from "@/constants/keywords";
import useToaster from "@/hooks/useToaster";
import { toast } from "react-toastify";
import { FormProvider, RHFTextInput } from "@/components/hook-form";
import { useRouter } from "next/navigation";

import {
  checkUserAction,
  registerAction,
  updateProfileAction,
  verifyRegisterAction,
} from "@/redux/Auth/action";
import { PATH_AUTH } from "@/routes/paths";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckBox from "@/components/CheckBox";
import { Wizard, useWizard } from "react-use-wizard";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { State } from "country-state-city";

import { upload } from "../../../utils/helpers";
const SignupPage = () => {
  const { toaster } = useToaster();
  const route = useRouter();

  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [fileImg, setFileImg] = useState("");
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedPrivacy, setIsCheckedPrivacy] = useState(false);
  const [isCheckedHonesty, setIsCheckedHonesty] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [isDOBError, setIsDOBError] = useState(false);
  const [isProfileError, setIsProfileError] = useState(false);
  const [isTermsError, setIsTermsError] = useState(false);

  let isFirstName = false;
  //Date input

  const currentDate = new Date();
  const initialYear = currentDate.getFullYear() - 18;
  const [myMonth, setMyMonth] = useState(null);
  const [myYear, setMyYear] = useState(null);
  const [myDay, setMyDay] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const defaultDate = new Date();

  const minDate = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    : defaultDate;

  const maxDate = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    : defaultDate;

  const datesAreEqual = (date1, date2) => {
    return (
      date1 instanceof Date &&
      date2 instanceof Date &&
      date1.getTime() === date2.getTime()
    );
  };
  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  useEffect(() => {
    if (myMonth !== null && myYear !== null && myDay !== null) {
      setIsDOBError(false);
      const newDate = new Date(
        myYear.getFullYear(),
        myMonth.getMonth(),
        myDay.getDate()
      );
      if (!datesAreEqual(newDate, selectedDate)) {
        setSelectedDate(newDate);
      }
    }
  }, [myMonth, myYear, myDay]);

  const handleStateChange = (event) => {
    const { value } = event.target;
    setSelectedState(value);
  };

  // const selector = useSelector((state) => state.registerApi);
  const registerData = useSelector((state) => state.registerApi.registerData);

  // FirstName Methods
  const onSubmitFormFirstName = async (formData, nextStep) => {
    const { firstName } = formData;
    setFirstName(firstName);
    nextStep();
  };
  const defaultValuesFirstName = useMemo(
    () => ({
      firstName: "",
    }),

    []
  );
  const formSchemaFistName = useMemo(() => {
    return yup
      .object()
      .shape({
        firstName: yup
          .string()
          .required("Please Enter FirstName")
          .trim("Please Entre Valid FirstName"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsFirstName = useForm({
    resolver: yupResolver(formSchemaFistName),
    defaultValuesFirstName,
  });

  //LastName Methods
  const onSubmitFormLastName = async (formData, nextStep) => {
    const { lastName } = formData;
    setLastName(lastName);

    nextStep();
  };
  const defaultValuesLastName = useMemo(
    () => ({
      lastName: "",
    }),
    []
  );
  const formSchemaLastName = useMemo(() => {
    return yup
      .object()
      .shape({
        lastName: yup
          .string()
          .required("Please Enter LastName")
          .trim("Please Entre Valid LastName"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsLastName = useForm({
    resolver: yupResolver(formSchemaLastName),
    defaultValuesLastName,
  });

  //  UserName Methods
  const onSubmitFormUserName = async (formData, nextStep) => {
    setIsLoading(true);
    const { userName } = formData;
    setUserName(userName);

    const payload = new FormData();
    payload.append("username", userName);

    try {
      const res = await dispatch(checkUserAction(payload));
      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(2);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(3);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesUserName = useMemo(
    () => ({
      userName: "",
    }),
    []
  );
  const formSchemaUserName = useMemo(() => {
    return yup
      .object()
      .shape({
        userName: yup
          .string()
          .required("Please Enter Username")
          .trim("Please Entre Valid Username"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsUserName = useForm({
    resolver: yupResolver(formSchemaUserName),
    defaultValuesUserName,
  });

  //  Password Methods
  const onSubmitFormPassword = async (formData, nextStep) => {
    const { password } = formData;
    setPassword(password);
    nextStep();
  };
  const defaultValuesPassword = useMemo(
    () => ({
      password: "",
    }),
    []
  );
  const formSchemaPassword = useMemo(() => {
    return (
      yup
        .object()
        // .shape({
        //   password: yup
        //     .string()
        //     .required("Please Enter Password")
        //     .trim("Please Entre Valid Password"),
        // })

        .shape({
          password: yup
            .string()
            .required("Password Is Required")
            .trim("Enter Valid Password"),
          //  .min(8, "Password is too short - should be at least 8 characters"),
          // .max(16, "Password is too long - should be at most 16 characters")
          // .matches(
          //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          //   "Password must contain alphabets, numbers, and special characters"
          // ),
        })
        .required()
        .strict(true)
    );
  }, []);
  const methodsPassword = useForm({
    resolver: yupResolver(formSchemaPassword),
    defaultValuesPassword,
  });

  //Confirm Password Methods
  const onSubmitFormConfirmPassword = async (formData, nextStep) => {
    const { confirmPassword } = formData;

    nextStep();
  };
  const defaultValuesConfirmPassword = useMemo(
    () => ({
      confirmPassword: "",
    }),
    []
  );
  const formSchemaConfirmPassword = useMemo(() => {
    return yup
      .object()
      .shape({
        confirmPassword: yup
          // .string()
          // .required("Please Enter Confirm Password")
          // .trim("Please Entre Valid Confirm Password")
          // .oneOf([yup.ref("password")], "Passwords must match"),

          .string()
          .required("Confirm password is required")
          .trim(),
        //.oneOf([password], "Passwords must match"),

        // .string()
        // .required("Password is required")
        // .trim("Enter valid password")
        // .min(8, "Password is too short - should be at least 8 characters")
        // .max(16, "Password is too long - should be at most 16 characters")
        // .matches(
        //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        //   "Password must contain alphabets, numbers, and special characters"
        // ),
      })
      .required()
      .strict(true);
  }, []);
  const methodsConfirmPassword = useForm({
    resolver: yupResolver(formSchemaConfirmPassword),
    defaultValuesConfirmPassword,
  });

  // Email Methods
  const onSubmitFormEmail = async (formData, nextStep) => {
    setIsLoading(true);
    const { email } = formData;

    const payload = new FormData();
    payload.append("firstname", firstName);
    payload.append("lastname", lastName);
    payload.append("username", userName);
    payload.append("email", email);
    payload.append("password", password);

    try {
      const res = await dispatch(registerAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(5);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(6);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
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

          .nullable()
          .trim()
          .lowercase()
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

  // Verify Code Methods

  const onSubmitFormVerifyCode = async (formData, nextStep) => {
    setIsLoading(true);
    const { verificationCode } = formData;

    const payload = new FormData();
    payload.append("verificationCode", verificationCode);
    payload.append("id", registerData.data.id);

    try {
      const res = await dispatch(verifyRegisterAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(6);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(7);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesVerifyCode = useMemo(
    () => ({
      verificationCode: "",
    }),
    []
  );
  const formSchemaVerifyCode = useMemo(() => {
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
  const methodsVerifyCode = useForm({
    resolver: yupResolver(formSchemaVerifyCode),
    defaultValuesVerifyCode,
  });

  // Contact Number Methods
  const onSubmitFormPhoneNumber = async (formData, nextStep) => {
    setIsLoading(true);
    const { phoneNumber } = formData;

    const payload = new FormData();
    payload.append("phone", phoneNumber);
    payload.append("id", registerData.data.id);

    try {
      const res = await dispatch(updateProfileAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(7);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(8);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesPhoneNumber = useMemo(
    () => ({
      phoneNumber: "",
    }),
    []
  );
  const formSchemaPhoneNumber = useMemo(() => {
    return yup
      .object()
      .shape({
        phoneNumber: yup
          .string()

          .matches(/^[0-9]{10}$/, "Phone Number Must Be Exactly 10 Digits")
          .required("Phone Number Is Required"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsPhoneNumber = useForm({
    resolver: yupResolver(formSchemaPhoneNumber),
    defaultValuesPhoneNumber,
  });

  // DOB Methods

  const formatDate = ({ year, month, day }) => {
    if (year && month && day) {
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
    return "";
  };
  const dob = formatDate({
    year: myYear !== null ? myYear.getFullYear() : null,
    month: myMonth !== null ? myMonth.getMonth() + 1 : null,
    day: myDay !== null ? myDay.getDate() : null,
  });

  const onSubmitFormDOB = async (nextStep) => {
    if (!myDay) {
      setIsDOBError(true);
      return;
    }
    if (!myMonth) {
      setIsDOBError(true);
      return;
    }
    if (!myYear) {
      setIsDOBError(true);
      return;
    }

    setIsDOBError(false);

    setIsLoading(true);

    const payload = new FormData();
    payload.append("dob", dob);
    payload.append("id", registerData.data.id);

    try {
      const res = await dispatch(updateProfileAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(8);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(9);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  // const defaultValuesDOB = useMemo(
  //   () => ({
  //     phoneNumber: "",
  //   }),
  //   []
  // );
  // const formSchemaDOB = useMemo(() => {
  //   return yup
  //     .object()
  //     .shape({
  //       phoneNumber: yup
  //         .string()
  //         .required("Please Enter Date Of Birth")
  //         .trim("Please Entre Date Of Birth"),
  //     })
  //     .required()
  //     .strict(true);
  // }, []);
  // const methodsDOB = useForm({
  //   resolver: yupResolver(formSchemaDOB),
  //   defaultValuesDOB,
  // });

  // Address Methods
  const onSubmitFormAddress = async (formData, nextStep) => {
    setIsLoading(true);
    const { address, city, zipcode } = formData;

    const payload = new FormData();
    payload.append("address", address);
    payload.append("city", city);
    payload.append("state", selectedState);
    payload.append("pincode", zipcode);
    payload.append("id", registerData.data.id);
    try {
      const res = await dispatch(updateProfileAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(9);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(10);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesAddress = useMemo(
    () => ({
      address: "",
      city: "",
      zipcode: "",
    }),
    []
  );
  const formSchemaAddress = useMemo(() => {
    return yup
      .object()
      .shape({
        address: yup
          .string()
          .required("Please Enter Address")
          .trim("Please Entre Address"),
        city: yup
          .string()
          .required("Please Enter Address")
          .trim("Please Entre Address"),
        zipcode: yup
          .string()
          .required("Please Enter Zipcode")
          .trim("Please Entre Zipcode"),
      })
      .required()
      .strict(true);
  }, []);
  const methodsAddress = useForm({
    resolver: yupResolver(formSchemaAddress),
    defaultValuesAddress,
  });

  // Picture Methods
  const onSubmitFormPicture = async (formData, nextStep) => {
    if (!profileImg) {
      setIsProfileError(true);
      return;
    }

    setIsLoading(true);

    let s3Data = await upload(
      fileImg,
      "userImages",
      fileImg.extension || "",
      fileImg.type || ""
    );

    if (!s3Data) {
      toast.error("Uploading failed");
      setIsLoading(false);

      return false;
    }

    setIsProfileError(false);

    const payload = new FormData();

    payload.append("id", registerData.data.id);
    payload.append("image", s3Data.Location);
    try {
      const res = await dispatch(updateProfileAction(payload));

      if (!res.payload.status) {
        setIsLoading(false);
        setActiveIndex(10);
        toaster(res.payload.message, TOAST_TYPES.ERROR);
      } else {
        nextStep();
        setActiveIndex(11);
        setIsLoading(false);
        toaster(res.payload.message, TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      toast.error(TOAST_ALERTS.ERROR_MESSAGE);
    }
  };
  const defaultValuesPicture = useMemo(() => ({}), []);
  const formSchemaPicture = useMemo(() => {
    return yup.object().shape({}).required().strict(true);
  }, []);
  const methodsPicture = useForm({
    resolver: yupResolver(formSchemaPicture),
    defaultValuesPicture,
  });

  // Terms Methods
  const onSubmitFormTerms = async (formData, nextStep) => {
    if (!isCheckedHonesty) {
      setIsTermsError(true);
      setActiveIndex(11);
      return;
    }
    if (!isCheckedTerms) {
      setIsTermsError(true);
      setActiveIndex(11);
      return;
    }
    if (!isCheckedPrivacy) {
      setIsTermsError(true);
      setActiveIndex(11);
      return;
    }
    nextStep();
    setIsTermsError(false);
    setActiveIndex(12);
  };
  const defaultValuesTerms = useMemo(() => ({}), []);

  const formSchemaTerms = useMemo(() => {
    return yup.object().shape({}).required().strict(true);
  }, []);
  const methodsTerms = useForm({
    resolver: yupResolver(formSchemaTerms),
    defaultValuesTerms,
  });

  const selectedCategoryOpt = (selectedValue) => {
    setSelectedState(selectedValue.value);
  };
  ///////
  const onSubmitForm = async (formData) => {
    const { firstName } = formData;
  };

  // Form Config
  const defaultValues = useMemo(
    () => ({
      firstName: "",
    }),
    []
  );

  const renderDayContents = (day, date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  const formSchema = useMemo(() => {
    return yup
      .object()
      .shape({
        firstName: yup
          .string()
          .required("please Enter Name")
          .trim("Please Enter Valid Name"),
      })
      .required()
      .strict(true);
  }, []);

  //Hooks
  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const handleCheckboxChangeTerms = () => {
    setIsCheckedTerms(!isCheckedTerms);
    const termsData = !isCheckedTerms;
    if (!termsData) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedPrivacy) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedHonesty) {
      setIsTermsError(true);
      return;
    }
    setIsTermsError(false);
  };
  const handleCheckboxChangePrivacy = () => {
    setIsCheckedPrivacy(!isCheckedPrivacy);

    const termsData = !isCheckedPrivacy;
    if (!termsData) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedTerms) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedHonesty) {
      setIsTermsError(true);
      return;
    }
    setIsTermsError(false);
  };
  const handleCheckboxChangeHonesty = () => {
    setIsCheckedHonesty(!isCheckedHonesty);
    const termsData = !isCheckedHonesty;

    if (!termsData) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedTerms) {
      setIsTermsError(true);
      return;
    }
    if (!isCheckedPrivacy) {
      setIsTermsError(true);
      return;
    }
    setIsTermsError(false);
  };

  const onClickContinue = () => {
    route.replace("/login");
  };

  const onVerifyOtpChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input length is less than or equal to 4
    if (inputValue.length <= 4) {
      setOtp(inputValue);
    }
  };

  const Step1 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    const {
      handleSubmit: handleSubmitFistName,
      formState: { isSubmitting },
      reset: resetFistName,
      setValue,
    } = methodsFirstName;
    // Attach an optional handler

    return (
      <>
        <FormProvider
          methods={methodsFirstName}
          //onSubmit={handleSubmitFistName(onSubmitFormFirstName)}
          onSubmit={handleSubmitFistName((formData) =>
            onSubmitFormFirstName(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">First Name?</p>
              <RHFTextInput
                name="firstName"
                placeholder=""
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next"
              onClick={() => (isFirstName ? nextStep() : null)}
            >
              Next
            </button>
          </div>
        </FormProvider>
      </>
    );
  };

  function Step2() {
    const { nextStep, previousStep } = useWizard();
    const {
      handleSubmit: handleSubmitLastName,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsLastName;
    return (
      <>
        <FormProvider
          methods={methodsLastName}
          onSubmit={handleSubmitLastName((formData) =>
            onSubmitFormLastName(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Last Name?</p>
              <RHFTextInput
                name="lastName"
                placeholder=""
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }

  function Step3() {
    const { nextStep, previousStep } = useWizard();
    const {
      handleSubmit: handleSubmitUserName,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsUserName;
    return (
      <>
        <FormProvider
          methods={methodsUserName}
          onSubmit={handleSubmitUserName((formData) =>
            onSubmitFormUserName(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Username you would like ?</p>
              <RHFTextInput
                name="userName"
                placeholder=""
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }

  function Step4() {
    const { nextStep, previousStep } = useWizard();
    const {
      handleSubmit: handleSubmitPassword,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsPassword;
    return (
      <>
        <FormProvider
          methods={methodsPassword}
          onSubmit={handleSubmitPassword((formData) =>
            onSubmitFormPassword(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Create Password</p>
              <RHFTextInput
                name="password"
                type="password"
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }

  function Step5() {
    const { nextStep, previousStep } = useWizard();
    const {
      handleSubmit: handleSubmitConfirmPassword,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsConfirmPassword;
    return (
      <>
        <FormProvider
          methods={methodsConfirmPassword}
          onSubmit={handleSubmitConfirmPassword((formData) =>
            onSubmitFormConfirmPassword(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Confirm Password</p>
              <RHFTextInput
                name="confirmPassword"
                type="password"
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }

  function Step6() {
    const { nextStep, previousStep } = useWizard();
    const {
      handleSubmit: handleSubmitEmail,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsEmail;
    return (
      <>
        <FormProvider
          methods={methodsEmail}
          onSubmit={handleSubmitEmail((formData) =>
            onSubmitFormEmail(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Email ?</p>

              <RHFTextInput
                name="email"
                placeholder=""
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }
  function Step7() {
    const { handleStep, previousStep, nextStep } = useWizard();
    const {
      handleSubmit: handleSubmitVerifyCode,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsVerifyCode;
    return (
      <>
        <FormProvider
          methods={methodsVerifyCode}
          onSubmit={handleSubmitVerifyCode((formData) =>
            onSubmitFormVerifyCode(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Email Verification Code </p>
              <RHFTextInput
                name="verificationCode"
                placeholder=""
                className="textInput-signUp"
                type="text"
                value={otp}
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="center-container">
            <button
              className="btn-next mr-4"
              onClick={() => {
                previousStep();
              }}
            >
              Previous
            </button>
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }
  function Step8() {
    const { handleStep, previousStep, nextStep } = useWizard();

    const {
      handleSubmit: handleSubmitPhoneNumber,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsPhoneNumber;
    return (
      <>
        <FormProvider
          methods={methodsPhoneNumber}
          onSubmit={handleSubmitPhoneNumber((formData) =>
            onSubmitFormPhoneNumber(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Phone Number</p>
              <RHFTextInput
                name="phoneNumber"
                placeholder=""
                className="textInput-signUp"
              />
            </div>
          </div>
          <div className="center-container">
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }
  function Step9() {
    const { handleStep, previousStep, nextStep } = useWizard();

    return (
      <>
        <div className="pt-[12%] mb-[40px]">
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Date Of Birth?</p>

              <div className="flex">
                <div className="date-dropdown">
                  <DatePicker
                    showMonthYearPicker
                    dateFormat="MMMM"
                    renderCustomHeader={({ date }) => <div></div>}
                    selected={myMonth}
                    onChange={(date) => setMyMonth(date)}
                    placeholderText="MM"
                    className="date-dropdown-innerContainer"
                  />
                  <div className="dropdown-arrow">
                    <Image src="/images/dropdown.png" width={15} height={15} />
                  </div>
                </div>
                <div className="date-dropdown">
                  <DatePicker
                    dateFormat="dd"
                    renderCustomHeader={({ date }) => <div></div>}
                    selected={myDay}
                    renderDayContents={renderDayContents}
                    onChange={(date) => setMyDay(date)}
                    placeholderText="DD"
                    className="date-dropdown-innerContainer"
                  />
                  <div className="dropdown-arrow">
                    <Image src="/images/dropdown.png" width={15} height={15} />
                  </div>
                </div>
                <div className="date-dropdown">
                  <DatePicker
                    selected={myYear}
                    yearDropdownItemNumber={6}
                    onChange={(date) => setMyYear(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="YYYY"
                    maxDate={new Date(currentDate.getFullYear() - 18, 11, 31)}
                    className="date-dropdown-innerContainer"
                    showPopperArrow={true}
                  ></DatePicker>
                  <div className="dropdown-arrow">
                    <Image src="/images/dropdown.png" width={15} height={15} />
                  </div>
                </div>
              </div>

              {isDOBError ? (
                <p className="text-red mt-2">
                  {"Please Enter Valid Date Of Birth."}
                </p>
              ) : null}
            </div>
          </div>

          <div className="center-container">
            <button
              className="btn-next"
              onClick={() => onSubmitFormDOB(nextStep)}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  }
  function Step10() {
    const { handleStep, previousStep, nextStep } = useWizard();

    const {
      handleSubmit: handleSubmitAddress,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsAddress;
    return (
      <>
        <FormProvider
          methods={methodsAddress}
          onSubmit={handleSubmitAddress((formData) =>
            onSubmitFormAddress(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">What Is Your Address?</p>
              <RHFTextInput
                name="address"
                placeholder="Address"
                className="textInput-signUp"
              />
              <RHFTextInput
                name="city"
                placeholder="City"
                className="textInput-signUp mt-2"
              />
              <div>
                <div className="textInput-signUp mt-2">
                  <select
                    className="textInput-signUp "
                    value={selectedState}
                    onChange={handleStateChange}
                  >
                    <option value="" disabled>
                      State
                    </option>

                    {states.map((option) => (
                      <option>{option.name}</option>
                    ))}
                  </select>
                </div>

                <div className="textInput-signUp mt-2">
                  <RHFTextInput
                    name="zipcode"
                    placeholder="Zipcode"
                    className="textInput-signUp"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="center-container">
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setFileImg(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setIsProfileError("");
  };

  function Step11() {
    const { handleStep, previousStep, nextStep } = useWizard();
    const {
      handleSubmit: handleSubmitPicture,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsPicture;
    return (
      <>
        <FormProvider
          methods={methodsPicture}
          onSubmit={handleSubmitPicture((formData) =>
            onSubmitFormPicture(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <div className="center-container">
                <Image
                  src={profileImg ? profileImg : "/images/logo.png"}
                  className="h-[120px] w-[120px] rounded-full"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex justify-center items-center bg-black">
                <div className="p-8 rounded-lg shadow-md">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    name="image"
                    onChange={handleImageChange}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full text-sm text-center py-2 px-4 rounded-full border-0 font-semibold bg-black26 text-white hover:bg-gray-700 cursor-pointer"
                  >
                    Upload File
                  </label>
                </div>
              </div>

              {isProfileError ? (
                <p className="text-red mt-2 text-center">
                  {"Please Choose Picture."}
                </p>
              ) : null}

              <p className="textInput-txt-signUp mt-8">
                Choose Your Best Picture
              </p>
            </div>
          </div>
          <div className="center-container">
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }
  function Step12() {
    const { handleStep, previousStep, nextStep } = useWizard();
    const {
      handleSubmit: handleSubmitTerms,
      formState: { isSubmitting },
      reset,
      setValue,
    } = methodsTerms;
    return (
      <>
        <FormProvider
          methods={methodsTerms}
          onSubmit={handleSubmitTerms((formData) =>
            onSubmitFormTerms(formData, nextStep)
          )}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp w-[500px]">
                By clicking the boxes below you agree to our Terms of Services
                Privacy policy and honesty policy.
              </p>
              <div className="space-y-6 ml-[30px]">
                <CheckBox
                  text="Terms of Services"
                  isChecked={isCheckedTerms}
                  handleCheckboxChange={handleCheckboxChangeTerms}
                />
                <CheckBox
                  text="Privacy policy"
                  isChecked={isCheckedPrivacy}
                  handleCheckboxChange={handleCheckboxChangePrivacy}
                />
                <CheckBox
                  text="Honesty policy"
                  isChecked={isCheckedHonesty}
                  handleCheckboxChange={handleCheckboxChangeHonesty}
                />
              </div>
            </div>
          </div>
          {isTermsError ? (
            <p className="text-red mt-8 ml-[34%]">
              {
                "Please Check Terms of Services Privacy policy and honesty policy Checkbox."
              }
            </p>
          ) : null}
          <div className="center-container">
            <button className="btn-next">Next</button>
          </div>
        </FormProvider>
      </>
    );
  }

  function Step13() {
    const { handleStep, previousStep, nextStep } = useWizard();

    return (
      <>
        <div
          // methods={methods}
          // onSubmit={handleSubmit(onSubmitForm)}
          className="pt-[12%] mb-[40px]"
        >
          <div className="center-container">
            <div>
              <p className="textInput-txt-signUp">Thank you for joining us!</p>
            </div>
          </div>
          <div className="center-container">
            <button className="btn-next" onClick={onClickContinue}>
              Continue
            </button>
          </div>
        </div>
      </>
    );
  }

  // Constants
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="sign-up-containers">
          <div className="flex justify-end mr-12">
            <button className="btn-yellow" onClick={onClickContinue}>
              Sign in
            </button>
          </div>
          <Wizard startIndex={activeIndex}>
            <Step1 />
            <Step2 />
            <Step3 />
            <Step4 />
            <Step5 />
            <Step6 />
            <Step7 />
            <Step8 />
            <Step9 />
            <Step10 />
            <Step11 />
            <Step12 />
            <Step13 />
          </Wizard>
        </div>
      )}
    </>
  );
};

export default SignupPage;
