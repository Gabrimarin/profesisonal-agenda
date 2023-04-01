import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    const loginBody = z.object({
      email: z.string().email({
        message: "Invalid email address",
      }),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters",
      }),
    });

    const { email, password: bodyPassword } = loginBody.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const { password: prismaPassword, ...userWithoutPassword } = user;
      const passwordMatches = await bcrypt.compare(
        bodyPassword,
        prismaPassword
      );
      if (passwordMatches) {
        const token = app.jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email,
        });
        reply.send({ token, user: userWithoutPassword });
      } else {
        reply.status(401).send({
          message: "Invalid credentials",
          fieldErrors: [
            {
              field: "password",
              message: "Invalid credentials",
            },
          ],
        });
      }
    } else {
      reply.status(401).send({
        message: "Invalid credentials",
        fieldErrors: [
          {
            field: "email",
            message: "User not found",
          },
        ],
      });
    }
  });

  app.get(
    "/me",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.user as { id: number };
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user) {
        const { password, ...userWithoutPassword } = user;
        reply.send(userWithoutPassword);
      } else {
        reply.status(404).send({
          message: "User not found",
        });
      }
    }
  );
}
