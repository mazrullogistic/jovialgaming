"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Header = ({ onToggleSidebar, isSidebarOpen, isLogin }) => {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname == "/resetPassword" ||
    pathname == "/forgotPassword";
  return (
    <>
      <div className="page-div">
        <div className="header-div">
          <Image
            className="relative"
            src="/images/Vector 2.svg"
            alt="header"
            width={700}
            height={250}
          />
          <span className="logo-div">Logo Here</span>
        </div>
        <div>
          {!isHomePage && (
            <div className="toggle-button-div">
              <button onClick={onToggleSidebar}>
                {isSidebarOpen ? (
                  <Image
                    src="/images/close.svg"
                    alt="close"
                    width={40}
                    height={22}
                  />
                ) : (
                  <Image
                    src="/images/bar.svg"
                    alt="toggle"
                    width={40}
                    height={22}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
