import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");
app.get(
  "/docs",
  async (c, next) => {
    if (process.env.NODE_ENV === "production") return c.notFound();
    await next();
  },
  Scalar({
    url: "/api/open-api",
    theme: "kepler",
    layout: "modern",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "axios",
    },
  }),
);

export const GET = handle(app);
