"use client";

import {
  Inter,
  Outfit,
  Roboto,
  Rubik,
  Archivo,
  Inter_Tight,
} from "next/font/google";
import { Open_Sans } from "next/font/google";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/steps-bar";
import MainDiv from "@/components/styles/main.style";
import Stepbardiv from "@/components/styles/stepsbar.style.";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ToastWrapper from "@/components/ToastContainer";
import StyledJsxRegistry from "./registry";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import ProtectedPageService from "@/services/protectedPage";
import { getData, setIsMobile } from "@/utils/storage";
import { SocketKEY } from "@/constants/keywords";
import socket from "@/socket/socket";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const inter_tight = Inter_Tight({
  variable: "--font-inter_tight",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],

  subsets: ["latin"],
});
const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({ subsets: ["latin"] });
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});
export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  var isMobileRes = "";
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname == "/resetPassword" ||
    pathname == "/forgotPassword";

  useEffect(() => {
    const user = getData("user");

    if (user?.token && !SocketKEY.socketConnect) {
      socket.start();
    } else {
      console.warn("User not found yet. Will retry socket connection later.");
    }
  }, [!isLoginPage]);

  useEffect(() => {
    // Function to check if the screen is mobile
    const handleResize = () => {
      // console.log("window.innerWidth <= 768", window.innerWidth <= 768);
      isMobileRes = window.innerWidth <= 768;
      setIsMobile(window.innerWidth <= 768, "mobile"); // Adjust the breakpoint as per your design
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <html lang="en">
      {/* google ads script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5381942317128703"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <body
        className={`${inter.className} ${open_sans.className} ${archivo.variable}  ${inter_tight.variable}`}
      >
        <Provider store={store}>
          <ProtectedPageService />
          <ToastWrapper />

          <StyledJsxRegistry>{children}</StyledJsxRegistry>
        </Provider>
      </body>
    </html>
  );
}
