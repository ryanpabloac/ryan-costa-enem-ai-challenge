import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./health.route.js";

export function registerRoutes(app: FastifyInstance) {
    app.register(healthRoutes);
}