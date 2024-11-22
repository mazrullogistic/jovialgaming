"use client";

import SideMenu from "@/components/SideMenu";

import SideMenuMobile from "@/components/SideMenuMobile";
import React from "react";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the screen is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as per your design
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
    <div>
      {isMobile ? (
        <SideMenuMobile>{children}</SideMenuMobile>
      ) : (
        <SideMenu>{children}</SideMenu>
      )}
    </div>
  );
};

export default Layout;
