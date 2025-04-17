import { authRoute } from "@/feature/auth/server/route";
import dashBoardRoute from "@/feature/admin/dashboard/server/route";
import { enrollmentRoute } from "@/feature/enroll/server/route";
import { schedulesRoutes } from "@/feature/schedules/server/route";
import { tokenRoute } from "@/feature/token/server/route";
import { uploads } from "@/feature/uploads/server/route";
import { userRoutes } from "@/feature/user/server/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import organizationRoutes from "@/feature/organization/server/route";
import { orgUsersRoute } from "@/feature/organization/users/server/route";
import { transactionRoutes } from "@/feature/transaction/server/route";
import { subscriptionRoute } from "@/feature/subscription/server/route";
import appointmentRoutes from "@/feature/payments/appointmentPayments/server/route";
import { paymentWebhook } from "@/feature/payments/webhooks/server/route";

// export const runtime = "edge"

const app = new Hono().basePath("/api/main");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/enroll", enrollmentRoute)
  .route("/token", tokenRoute)
  .route("/auth", authRoute)
  .route("/admin/dashboard", dashBoardRoute)
  .route("/uploads", uploads)
  .route("/schedules", schedulesRoutes)
  .route("/user", userRoutes)
  .route("/org", organizationRoutes)
  .route("/org/transactions", transactionRoutes)
  .route("/org/users", orgUsersRoute)
  .route("/org/subscription", subscriptionRoute)
  .route("/payments/appointment", appointmentRoutes)
  .route("/payments/webhook", paymentWebhook);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
