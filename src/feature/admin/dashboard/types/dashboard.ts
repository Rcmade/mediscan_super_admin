import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

export type DashboardStatsResponseT = InferResponseType<
  (typeof client.api.main.admin.dashboard.stats)[":webName"]["$get"],
  200
>;

export type DashboardStatsRequestT = InferRequestType<
  (typeof client.api.main.admin.dashboard.stats)[":webName"]["$get"]
>;
