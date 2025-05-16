"use client";
import useWebName from "@/hooks/useWebName";
import React from "react";

const Title = () => {
  const { webName } = useWebName();
  const name = webName ? decodeURIComponent(webName)?.toLocaleUpperCase() : "";
  return name ? <title>{name}</title> : null;
};

export default Title;
