import { alertVariants } from "@/components/ui/alert";
import { VariantProps } from "class-variance-authority";
export type AlertVarientT = VariantProps<typeof alertVariants>["variant"];

export type SearchParamsPromise = Promise<{ [key: string]: string }>;
export type ParamsPromise = Promise<{ [key: string]: string }>;

export type SearchParams = {
  [key: string]: string;
};

export type PagePropsPromise = {
  params: ParamsPromise;
  searchParams: SearchParamsPromise;
};

export type Children = {
  children: React.ReactNode;
};

export type PageProps = {
  params: { [key: string]: string };
  searchParams: SearchParams;
};

export type SignatureReturnT = {
  timestamp: number;
  upload_preset: string;
  source: string;
  signature: string;
};


export type RazorpayResponseT = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
