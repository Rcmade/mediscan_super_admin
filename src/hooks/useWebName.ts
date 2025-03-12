"use client"
import { useParams } from "next/navigation";

const useWebName = () => {
  const { webName } = useParams();
  return { webName: webName as string };
};

export default useWebName;
