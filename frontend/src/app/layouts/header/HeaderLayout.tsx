"use client";
import useWindowDimensions from "@/app/hooks/useWindowDimentionsHook";
import React from "react";
import { HeaderMobile } from "./HeaderMobile";
import { HeaderBigScreens } from "./HeaderBigScreens";

export const HeaderLayout = () => {
  const { width } = useWindowDimensions();
  if (width > 1024) {
    return <HeaderBigScreens />;
  }
  if (width <= 1024) {
    return <HeaderMobile />;
  }
};
