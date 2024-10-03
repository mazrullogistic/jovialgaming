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
import React, { useState } from "react";
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname == "/resetPassword" ||
    pathname == "/forgotPassword";

  return (
    <html lang="en">
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
    /* <html lang="en">
      <body className={`${inter.className} ${open_sans.className}`}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId="598913711908-ps1ud5pqp6diuci99laprr35pkbqffoa.apps.googleusercontent.com">
            <ProtectedPageService />
            <ToastWrapper />
            <div>
              <div>
                {!isLoginPage && isSidebarOpen && (
                  <Stepbardiv $isvisible={isSidebarOpen}>
                    <Sidebar />
                  </Stepbardiv>
                )}
                <MainDiv $isvisible={isSidebarOpen}>
                  <Header
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                  <StyledJsxRegistry>{children}</StyledJsxRegistry>
                </MainDiv>
              </div>
            </div>
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html> */
  );
}
