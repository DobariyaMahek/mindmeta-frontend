import React, { useEffect, useState } from "react";
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import Patients from "examples/Icons/Patients";
import { useLocation } from "react-router-dom";
import Patient from "layouts/patient";
import CreatePatient from "layouts/patient/CreatePatient";
import CalendarComponent from "layouts/interaction/calender";
import Package from "layouts/package";
import CallHistory from "layouts/CallHistory";
import ForgotPassword from "layouts/authentication/forgotPassword";
import Interaction from "layouts/interaction";
import {
  CalendarMonth,
  Collections,
  History,
  HomeSharp,
  Layers,
  ManageAccounts,
  ModelTraining,
  PermMedia,
  Person4,
  SmartToy,
  Textsms,
  ThreeP,
} from "@mui/icons-material";
import Call from "layouts/Call";
import { getSession } from "helper/authHelper";
import MediaInteraction from "layouts/mediaInteraction";
import VerifyOTP from "layouts/authentication/verifyOTP";
import ResetPassword from "layouts/authentication/resetPassword";
import ChatBot from "layouts/interaction/chatbot";
import TrainingLogs from "layouts/traininglog";
import PhotoGallery from "layouts/PhototGallery";

const useRoutes = () => {
  // State to track open dropdown
  const location = useLocation();
  const { pathname } = location;
  const userInfo = getSession();
  const collapseName = pathname;
  const [openDropdown, setOpenDropdown] = useState(
    collapseName === "/patients" ||
      collapseName === "/create-patients" ||
      collapseName?.startsWith("/update-patient/")
      ? "patients"
      : collapseName?.startsWith("/chatbot") || collapseName === "/call-calendar"
      ? "chatbot"
      : null
  );

  const handleClick = (key) => {
    // Toggle dropdown open state
    setOpenDropdown((prev) => (prev === key ? prev : key));
  };
  useEffect(() => {
    if (collapseName === "/patients" || collapseName === "/create-patients") {
      handleClick("patients");
    } else if (collapseName?.startsWith("/chatbot") || collapseName === "/call-calendar") {
      handleClick("chatbot");
    }
  }, [collapseName]);
  return [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      route: "/dashboard",
      icon: <HomeSharp size="12px" />,
      component: <Dashboard />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/dashboard",
      isShow: true,
      onClick: () => handleClick("dashboard"),
      isOpen: openDropdown === "dashboard",
    },
    {
      type: "collapse",
      name: "Patients Management",
      key: "patients",
      noCollapse: true,
      isProtected: true,
      icon: <ManageAccounts size="12px" />,
      isActive:
        collapseName === "/patients" ||
        collapseName === "/create-patients" ||
        collapseName?.startsWith("/update-patient/"),
      collapse: [
        {
          name: "Patient List",
          key: "patient-list",
          route: "/patients",
          component: <Patient />,
          noCollapse: true,
          isProtected: true,
          isActive: collapseName === "/patients" || collapseName?.startsWith("/update-patient/"),
          isShow: userInfo?.role === "care_home",
        },
        {
          name: "Create Patient",
          key: "create-patient",
          route: "/create-patients",
          component: <CreatePatient />,
          noCollapse: true,
          isProtected: true,
          isActive: collapseName === "/create-patients",
          isShow: userInfo?.role === "care_home",
        },
        {
          name: "Update Patient",
          key: "update-patient",
          route: "/update-patient/:id",
          component: <CreatePatient />,
          noCollapse: true,
          isProtected: true,
          isActive: collapseName === "/update-patient/:id",
          isShow: false,
        },
      ],
      isShow: userInfo?.role === "care_home",
      onClick: () => handleClick("patients"),
      isOpen: openDropdown === "patients",
    },
    // {
    //   type: "collapse",
    //   name: "Patient Interaction",
    //   key: "chatbot",
    //   noCollapse: true,
    //   isProtected: true,
    //   icon: <Textsms size="12px" />,
    //   isActive: collapseName?.startsWith("/chatbot") || collapseName === "/call-calendar",
    //   collapse: [
    //     // {
    //     //   name: "Chatbot",
    //     //   key: "chatbot",
    //     //   route: "/chatbot",
    //     //   component: <Interaction />,
    //     //   noCollapse: true,
    //     //   isProtected: true,
    //     //   isActive: collapseName?.startsWith("/chatbot"),
    //     //   isShow: userInfo?.role === "care_home",
    //     // },

    //     {
    //       name: "Call Calendar",
    //       key: "call-calendar",
    //       route: "/call-calendar",
    //       component: <CalendarComponent />,
    //       noCollapse: true,
    //       isProtected: true,
    //       isActive: collapseName === "/call-calendar",
    //       isShow: userInfo?.role === "care_home",
    //     },
    //   ],
    //   isShow: userInfo?.role === "care_home",
    //   onClick: () => handleClick("chatbot"),
    //   isOpen: openDropdown === "chatbot",
    // },

    {
      type: "collapse",
      name: "Bot Interaction",
      key: "bot-interaction",
      route: `/chatbot/${
        userInfo?.role === "patient" && userInfo?.user_info ? userInfo?.user_info?.id : "123"
      }`,
      component: <ChatBot />,
      noCollapse: true,
      isProtected: true,
      icon: <SmartToy size="12px" />,
      isActive: collapseName?.startsWith("/chatbot"),
      isShow: userInfo?.role === "patient",
      onClick: () => handleClick("bot-interaction"),
      isOpen: openDropdown === "bot-interaction",
    },

    {
      type: "collapse",
      name: "Call History",
      key: "call-history",
      route: "/call-history",
      icon: <History size="12px" />,
      component: <CallHistory />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/call-history",
      isShow: userInfo?.role === "family_member",
      onClick: () => handleClick("call-history"),
      isOpen: openDropdown === "call-history",
    },
    {
      type: "collapse",
      name: "Photo Gallery",
      key: "photo-gallery",
      route: "/photo-gallery",
      icon: <Collections size="12px" />,
      component: <PhotoGallery />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/photo-gallery",
      isShow: userInfo?.role === "patient",
      onClick: () => handleClick("photo-gallery"),
      isOpen: openDropdown === "photo-gallery",
    },
    {
      type: "collapse",
      name: "Media and Instructions",
      key: "media-instruction",
      route: "/media-instruction",
      icon: <PermMedia size="12px" />,
      component: <MediaInteraction />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/media-instruction",
      isShow: userInfo?.role === "family_member",
      onClick: () => handleClick("media-instruction"),
      isOpen: openDropdown === "media-instruction",
    },
    {
      type: "collapse",
      name: "Training Logs",
      key: "training-logs",
      route: "/training-logs",
      icon: <ModelTraining size="12px" />,
      component: <TrainingLogs />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/training-logs",
      isShow: userInfo?.role === "family_member",
      onClick: () => handleClick("training-logs"),
      isOpen: openDropdown === "training-logs",
    },
    {
      type: "collapse",
      name: "Call Calendar",
      key: "call-calendar",
      route: "/call-calendar",
      icon: <CalendarMonth size="12px" />,
      component: <CalendarComponent />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/call-calendar",
      isShow: userInfo?.role === "patient" || userInfo?.role === "care_home",
      onClick: () => handleClick("call-calendar"),
      isOpen: openDropdown === "call-calendar",
    },
    // {
    //   type: "collapse",
    //   name: "Package",
    //   key: "package",
    //   route: "/package",
    //   icon: <Layers size="12px" />,
    //   component: <Package />,
    //   noCollapse: true,
    //   isProtected: true,
    //   isActive: collapseName === "/package",
    //   isShow: userInfo?.role === "care_home" || userInfo?.role === "family_member",
    //   onClick: () => handleClick("package"),
    //   isOpen: openDropdown === "package",
    // },
    {
      type: "collapse",
      name: "Profile",
      key: "profile",
      route: "/profile",
      icon: <Person4 size="12px" />,
      component: <Profile />,
      noCollapse: true,
      isProtected: true,
      isActive: collapseName === "/profile",
      isShow: userInfo?.role === "care_home",
      onClick: () => handleClick("profile"),
      isOpen: openDropdown === "profile",
    },
    {
      type: "collapse",
      name: "Sign In",
      key: "sign-in",
      route: "/authentication/sign-in",
      icon: <Document size="12px" />,
      component: <SignIn />,
      noCollapse: true,
      isProtected: false,
    },
    {
      type: "collapse",
      name: "Forgot Password",
      key: "forgot-password",
      route: "/authentication/forgot-password",
      icon: <Document size="12px" />,
      component: <ForgotPassword />,
      noCollapse: true,
      isProtected: false,
    },
    {
      type: "collapse",
      name: "Verify OTP",
      key: "verify-otp",
      route: "/authentication/verify-otp",
      icon: <Document size="12px" />,
      component: <VerifyOTP />,
      noCollapse: true,
      isProtected: false,
    },
    {
      type: "collapse",
      name: "Reset Password",
      key: "reset-password",
      route: "/authentication/reset-password",
      icon: <Document size="12px" />,
      component: <ResetPassword />,
      noCollapse: true,
      isProtected: false,
    },
  ];
};

export default useRoutes;
