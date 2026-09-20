import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./health.route.js";
import { userRoutes } from "./user.route.js";

export function registerRoutes(app: FastifyInstance) {
    app.register(healthRoutes);
    app.register(userRoutes);
}