import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", async (_, reply) => {
        reply.status(200).send("ok");
    });
}