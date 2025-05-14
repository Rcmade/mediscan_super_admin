"use client";
import useWebName from "@/hooks/useWebName";
import React from "react";

const Title = () => {
  const { webName } = useWebName();
  return <title>{decodeURIComponent(webName)?.toLocaleUpperCase()}</title>;
};

export default Title;
