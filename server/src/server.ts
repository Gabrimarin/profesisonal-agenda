import Fastify from "fastify";
import { z } from "zod";
import { userRoutes } from "./routes/users";
import { clientRoutes } from "./routes/clients";
import jwt from "./plugins/jwt";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { activityRoutes } from "./routes/activities";
const PORT = process.env.PORT || 3030;
const app = Fastify();

app.register(jwt);
app.register(cors);
app.register(userRoutes, { prefix: "/users" });
app.register(clientRoutes, { prefix: "/clients" });
app.register(activityRoutes, { prefix: "/activities" });
app.register(authRoutes, { prefix: "/auth" });

app.setErrorHandler((error, _, reply) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    reply.status(400).send({
      message: "Invalid request",
      fieldErrors: error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  } else if (
    error.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
    error.code === "FST_JWT_INVALID_TOKEN" ||
    error.code === "FAST_JWT_MALFORMED"
  ) {
    reply.status(401).send({ message: "Unauthorized" });
  } else {
    console.log(error);
    console.log(typeof error);
    reply.status(500).send({ message: "Internal Server Error" });
  }
});

app
  .listen({
    port: Number(PORT),
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running on http://localhost:3333");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
