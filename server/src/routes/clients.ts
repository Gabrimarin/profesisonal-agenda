import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const CONTACT_TYPES = ["email", "phone", "other"];

const clientBody = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  contacts: z
    .array(
      z.object({
        id: z.any().optional(),
        value: z.string(),
        type: z.string().refine((type) => CONTACT_TYPES.includes(type), {
          message: `Type must be one of ${CONTACT_TYPES.join(", ")}`,
        }),
      })
    )
    .optional(),
});

export async function clientRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      console.log(request.body);

      const { name, contacts } = clientBody.parse(request.body);

      const client = await prisma.client.create({
        data: {
          name,
          contacts: {
            create: contacts,
          },
          userId: request.user.id,
        },
      });

      reply.send(client);
    }
  );

  app.get(
    "/",
    { preValidation: [app.authenticate] },
    async (request, reply) => {
      const clients = await prisma.client.findMany({
        where: {
          userId: request.user.id,
        },
        include: {
          contacts: true,
        },
      });
      reply.send(clients);
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
      const clienId = Number(id);
      const client = await prisma.client.findUnique({
        where: {
          id: clienId,
        },
        include: {
          contacts: true,
        },
      });
      reply.send(client);
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
      const clientId = Number(id);
      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
        include: {
          contacts: true,
        },
      });
      if (!client) {
        reply.status(404).send({ message: "Client not found" });
        return;
      }
      const { name, contacts } = clientBody.parse(request.body);
      const currentContactIds = client?.contacts?.map((c) => c.id) ?? [];
      const contactsToCreate = contacts
        ?.filter((c) => !currentContactIds.includes(Number(c.id)))
        .map((c) => ({ value: c.value, type: c.type }));
      const contactsToUpdate = contacts?.filter((c) =>
        currentContactIds.includes(Number(c.id))
      );
      const contactsToDelete = client?.contacts?.filter(
        (c) => !contacts?.some((c2) => c2.id === c.id)
      );
      const updatedClient = await prisma.client.update({
        where: {
          id: clientId,
        },
        data: {
          name,
          contacts: {
            create: contactsToCreate,
            update: contactsToUpdate?.map((c) => ({
              where: { id: Number(c.id) },
              data: { value: c.value, type: c.type },
            })),
            delete: contactsToDelete?.map((c) => ({ id: Number(c.id) })),
          },
        },
        include: {
          contacts: true,
        },
      });
      reply.send(updatedClient);
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
      const clienId = Number(id);
      const client = await prisma.client.delete({
        where: {
          id: clienId,
        },
      });
      reply.send(client);
    }
  );

  app.get(
    "/contact-types",
    { preValidation: [app.authenticate] },
    async (_, reply) => {
      reply.send(CONTACT_TYPES);
    }
  );
}
