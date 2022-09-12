import React, { useEffect, useState } from "react";
import Navbar from "../components/navbars/Navbar";
import BttomNavbar from "../components/navbars/BottomNavbar";
import Loading from "../components/utils/loading";

type LayoutProps = {
  children?: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {

  return (
    <div className={`relative mx-auto h-full bg-white overflow-y-hidden`}>
      <Navbar />
      <div
        className={`
        pt-[60px] pb-[60px] p-[5px] h-[100%] 
        overflow-y-auto scroll-bar-none
        `}
      >
        {children}
      </div>
      <BttomNavbar />
    </div>
  );
}
