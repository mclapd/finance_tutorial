import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

import { accounts } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
    // throw new HTTPException(401, { res: c.json({ error: "Unauthorized" }) });
  }

  const data = await db
    .select({ id: accounts.id, name: accounts.name })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));
  return c.json({ data });
});

export default app;
