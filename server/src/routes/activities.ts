import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const activityBody = z.object({
  name: z.string().optional(),
  clientId: z.number().optional(),
  activityTypeId: z.number().optional(),
  dateStart: z.string(),
  dateEnd: z.string().optional().nullable(),
  done: z.boolean().optional(),
  price: z.number().optional(),
});

export async function activityRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const {
        name,
        clientId,
        activityTypeId,
        dateStart,
        dateEnd,
        done,
        price,
      } = activityBody.parse(request.body);
      const activity = await prisma.activity.create({
        data: {
          userId: request.user.id,
          name: name ?? "",
          clientId: clientId ? Number(clientId) : undefined,
          activityTypeId: activityTypeId ? Number(activityTypeId) : undefined,
          dateStart: new Date(dateStart),
          dateEnd: dateEnd ? new Date(dateEnd) : undefined,
          done: done ?? false,
          price: price ?? 0,
        },
      });
      reply.send(activity);
    }
  );

  app.put(
    "/:id",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityId = Number(id);
      const {
        name,
        clientId,
        activityTypeId,
        dateStart,
        dateEnd,
        done,
        price,
      } = activityBody.parse(request.body);
      const activity = await prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          name,
          clientId: clientId ? Number(clientId) : undefined,
          activityTypeId: activityTypeId ? Number(activityTypeId) : undefined,
          dateStart: new Date(dateStart),
          dateEnd: dateEnd ? new Date(dateEnd) : undefined,
          done: done ?? false,
          price: price ?? 0,
        },
      });
      reply.send(activity);
    }
  );

  app.get(
    "/",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const activities = await prisma.activity.findMany({
        where: {
          userId: request.user.id,
        },
        include: {
          client: true,
          activityType: true,
        },
      });
      reply.send(activities);
    }
  );

  app.get(
    "/:id",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityId = Number(id);
      const activity = await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
        include: {
          client: true,
          activityType: true,
        },
      });
      if (!activity) {
        reply.status(404).send({ message: "Activity not found" });
        return;
      }
      reply.send(activity);
    }
  );

  app.delete(
    "/:id",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityId = Number(id);
      const activity = await prisma.activity.delete({
        where: {
          id: activityId,
        },
      });
      reply.send(activity);
    }
  );

  app.get(
    "/types",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const activityTypes = await prisma.activityType.findMany({
        where: {
          user: {
            id: request.user.id,
          },
        },
        include: {
          user: true,
          activities: true,
        },
      });
      reply.send(activityTypes);
    }
  );

  app.get(
    "/types/:id",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityTypeId = Number(id);
      const activityType = await prisma.activityType.findUnique({
        where: {
          id: activityTypeId,
        },
        include: {
          user: true,

          activities: true,
        },
      });
      if (!activityType) {
        reply.status(404).send({ message: "Activity type not found" });
        return;
      }
      reply.send(activityType);
    }
  );

  app.post(
    "/types",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const body = z.object({
        name: z.string(),
      });
      const { name } = body.parse(request.body);
      const activityType = await prisma.activityType.create({
        data: {
          name,
          userId: request.user.id,
        },
      });
      reply.send(activityType);
    }
  );

  app.put(
    "/types/:id",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const body = z.object({
        name: z.string(),
      });
      const { id } = params.parse(request.params);
      const { name } = body.parse(request.body);
      const activityType = await prisma.activityType.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });
      reply.send(activityType);
    }
  );

  app.delete(
    "/types/:id",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityType = await prisma.activityType.delete({
        where: {
          id: Number(id),
        },
      });
      reply.send(activityType);
    }
  );

  app.put(
    "/:id/toggle_done",
    {
      preValidation: [app.authenticate],
    },
    async (request, reply) => {
      const params = z.object({
        id: z.string(),
      });
      const { id } = params.parse(request.params);
      const activityId = Number(id);
      const activity = await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
        include: {
          client: true,
          activityType: true,
        },
      });
      if (!activity) {
        reply.status(404).send({ message: "Activity not found" });
        return;
      }
      const updatedActivity = await prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          done: !activity.done,
        },
      });
      reply.send(updatedActivity);
    }
  );
}
