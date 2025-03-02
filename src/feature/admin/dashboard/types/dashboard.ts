import { client } from "@/lib/rcp";
import { InferRequestType, InferResponseType } from "hono";

export type DashboardStatsResponseT = InferResponseType<
  typeof client.api.main.admin.dashboard.stats.$get,
  200
>;

export type DashboardStatsRequestT = InferRequestType<
  typeof client.api.main.admin.dashboard.stats.$get
>;
