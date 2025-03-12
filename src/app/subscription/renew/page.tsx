"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
// import Link from "next/link";
// import useViewSubscription from "@/feature/subscription/hooks/useViewSubscription";

const SubscriptionRenewPage = () => {
  // const { data } = useViewSubscription();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="border-b border-red-100 bg-red-50 text-center">
          <div className="mb-2 flex justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-700">
            Subscription Expired
          </CardTitle>
          <CardDescription className="text-red-600">
            Your access has been limited
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-2 pt-6">
          <p className="text-gray-700">
            Your subscription ends
            {/* on{" "}
            <span className="font-semibold">
              {data?.serviceEndDate
                ? new Date(data.serviceEndDate).toLocaleDateString()
                : "N/A"}
            </span> */}
            .
          </p>

          <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-800">
              How to Renew Your Subscription
            </h3>
            <p className="text-sm text-blue-700">
              Please contact your administrator to renew your subscription and
              restore full access to your account.
            </p>
          </div>

          {/* <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>support@yourcompany.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>+1 (800) 123-4567</span>
            </div>
          </div> */}
        </CardContent>

        {/* <CardFooter className="flex gap-3 pb-6 pt-2">
          <Button variant="outline" className="w-1/2" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button className="w-1/2 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="mailto:support@yourcompany.com">Contact Support</Link>
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default SubscriptionRenewPage;
