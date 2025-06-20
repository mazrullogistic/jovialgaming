"use client";

import SideMenu from "@/components/SideMenu";
import SideMenuMobile from "@/components/SideMenuMobile";
import React, { useState, useEffect } from "react";
import { getIsMobile } from "@/utils/storage";
// import socket from "@/socket/socket";

const Layout = ({ children }) => {
  // Render the layout with either mobile or desktop side menu
  var isMobile = getIsMobile("mobile");

  return (
    <div>
      <SideMenuMobile>{children}</SideMenuMobile>
    </div>
  );
};

export default Layout;
