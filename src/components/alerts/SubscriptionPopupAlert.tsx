"use client";
import useViewSubscription from "@/feature/subscription/hooks/useViewSubscription";
import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { differenceInDays, isBefore } from "date-fns";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SubscriptionPopupAlert = () => {
  const { data, isLoading } = useViewSubscription();
  const user = useCurrentUser();
  const router = useRouter();

  // Calculate days remaining in subscription
  const daysRemaining = data?.serviceEndDate
    ? differenceInDays(new Date(data.serviceEndDate), new Date())
    : 0;

  // Navigate to another page if subscription has ended
  useEffect(() => {
    if (
      data &&
      isBefore(new Date(data.serviceEndDate), new Date()) &&
      user?.role !== "SUPER_ADMIN"
    ) {
      router.push("/subscription/renew");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user]);

  if (isLoading || !data) return null;

  // Don't show anything if days remaining is more than 15
  // if (daysRemaining > 15) return null;

  // Show warning alert when subscription is about to end (within 15 days)
  if (daysRemaining > 0) {
    return (
      <Alert
        variant="destructive"
        className="my-8 border-amber-200 bg-amber-50"
      >
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">
          Subscription Ending Soon
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          Your subscription will expire in {daysRemaining} day
          {daysRemaining !== 1 ? "s" : ""}. Please renew to maintain
          uninterrupted access.
        </AlertDescription>
      </Alert>
    );
  }

  // Show error alert when subscription has ended
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Subscription Expired</AlertTitle>
      <AlertDescription>
        Your subscription has ended.{" "}
        {user?.role !== "SUPER_ADMIN" &&
          "You're being redirected to the renewal page."}
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionPopupAlert;
