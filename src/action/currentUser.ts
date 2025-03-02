"use server";

import { auth } from "@/config/authConfig";
export const currentUser = async () => {
  const user = await auth();
  return user?.user;
};
