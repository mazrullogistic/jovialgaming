"use client";

import SideMenu from "@/components/SideMenu";
import SideMenuMobile from "@/components/SideMenuMobile";
import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { getIsMobile } from "@/utils/storage";

const Layout = ({ children }) => {
  // Render the layout with either mobile or desktop side menu
  var isMobile = getIsMobile("mobile");
  console.log("isMobile", isMobile);
  return (
    <div>
      <SideMenuMobile>{children}</SideMenuMobile>
    </div>
  );
};

export default Layout;
