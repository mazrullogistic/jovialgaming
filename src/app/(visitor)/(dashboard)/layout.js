import SideMenu from "@/components/SideMenu";
import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <SideMenu>{children}</SideMenu>
    </>
  );
};

export default Layout;
