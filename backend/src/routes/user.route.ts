import { createUser } from "@/services/user.service.js";
import { createUserSchema, type CreateUserDTO } from "@/zod/user.zod.js";
import type { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', {schema: { body: createUserSchema }}, async(req, reply) => {
        const userData: CreateUserDTO = req.body as CreateUserDTO;

        await createUser(userData);

        return reply.status(201).send();
    });
}