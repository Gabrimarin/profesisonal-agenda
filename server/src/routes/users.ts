import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBody = z.object({
      name: z.string().min(2, {
        message: "Name must be at least 2 characters",
      }),
      email: z.string().email({
        message: "Invalid email address",
      }),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters",
      }),
    });
    const { email, name, password } = createUserBody.parse(request.body);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      reply.status(409).send({
        message: "User already exists",
      });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const { password: createdPassword, ...userWithoutPassword } =
        await prisma.user.create({
          data: {
            email,
            name,
            password: encryptedPassword,
          },
        });
      reply.send(userWithoutPassword);
    }
  });

  app.get("/", async (request, reply) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    reply.send(users);
  });
}
