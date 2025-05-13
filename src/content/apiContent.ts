type ApiGroup = {
  apiPrefix: string;
  name: string;
  appTypeCompletePath: string;
  type: "http"; // future proofing
};

export const apis: ApiGroup[] = [
  {
    apiPrefix: "/enroll",
    name: "Enrollment routes",
    appTypeCompletePath: "src/feature/enroll/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/token",
    name: "Tokens routes",
    appTypeCompletePath: "src/feature/token/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/auth",
    name: "Authentication Routes",
    appTypeCompletePath: "src/feature/auth/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/admin/dashboard",
    name: "Admin Dashboard routes",
    appTypeCompletePath: "src/feature/admin/dashboard/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/uploads",
    name: "File Upload routes",
    appTypeCompletePath: "src/feature/uploads/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/schedules",
    name: "Schedules routes",
    appTypeCompletePath: "src/feature/schedules/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/user",
    name: "User routes",
    appTypeCompletePath: "src/feature/user/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/org",
    name: "Organization routes",
    appTypeCompletePath: "src/feature/organization/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/org/transactions",
    name: "Organization Transaction routes",
    appTypeCompletePath: "src/feature/transaction/server/route.ts",
    type: "http",
  },

  {
    apiPrefix: "/org/users",
    name: "Organization User routes",
    appTypeCompletePath: "src/feature/organization/users/server/route.ts",
    type: "http",
  },

  {
    apiPrefix: "/org/subscription",
    name: "Organization Subscription routes",
    appTypeCompletePath: "src/feature/subscription/server/route.ts",
    type: "http",
  },
  {
    apiPrefix: "/features/appointment-reasons",
    name: "Appointment Reason Type routes",
    appTypeCompletePath: "src/feature/appointmentReasonType/server/route.ts",
    type: "http",
  },

  {
    apiPrefix: "/payments/appointment",
    name: "Appointment Payment routes",
    appTypeCompletePath:
      "src/feature/payments/appointmentPayments/server/route.ts",
    type: "http",
  },


  {
    apiPrefix: "/payments/webhook",
    name: "Payment Webhook routes",
    appTypeCompletePath: "src/feature/payments/webhooks/server/route.ts",
    type: "http",
  },
];
