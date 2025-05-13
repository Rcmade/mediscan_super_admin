import { Hono } from "hono";
import { handle } from "hono/vercel";
import fs from "node:fs/promises";
import path from "node:path";

const app = new Hono().basePath("/api");

app.get("/open-api", async (c) => {
  if (process.env.NODE_ENV === "production") return c.notFound();

  const raw = await fs.readFile(
    path.join(process.cwd(), "gen/output/openApi/openapi.json"),
    "utf-8",
  );

  const data = JSON.parse(raw);

  return c.json(data);
});

export const GET = handle(app);
