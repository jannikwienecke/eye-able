import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const { API_TOKEN } = process.env;

if (!API_TOKEN) {
  throw new Error("API_TOKEN is not set");
}

const app = new Elysia()
  .use(
    openapi({
      path: "/openapi",
    })
  )
  .get("/", "Hallo Welt")
  .get(
    "/hallo/:name",
    ({ params }) =>
      `Hallo ${params.name}. Heute ist der ${new Date().toLocaleDateString(
        "de-DE"
      )}`,
    {
      params: t.Object({
        name: t.String(),
      }),
      beforeHandle: ({ request }) => {
        const expectedToken = process.env.API_TOKEN ?? "";

        const authHeader = request.headers.get("authorization") || "";
        const isAuthorized = authHeader === `Bearer ${expectedToken}`;

        if (!isAuthorized) return new Response("Unauthorized", { status: 401 });
      },
    }
  )
  .listen({ port: 3000, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
