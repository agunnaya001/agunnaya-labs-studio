import { Router } from "express";
import { auth } from "../lib/auth";

const router = Router();

router.all("/auth/{*path}", async (req, res) => {
  try {
    const url = new URL(
      req.originalUrl.replace(/^\/api/, ""),
      `http://${req.headers.host || "localhost"}`,
    );

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          headers.set(key, value.join(", "));
        } else {
          headers.set(key, value);
        }
      }
    }

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined;

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    const response = await auth.handler(request);

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await response.text();
    res.send(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth error";
    res.status(500).json({ error: message });
  }
});

export default router;
