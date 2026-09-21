import { login } from '@/services/auth.service.js';
import { loginSchema, type LoginRequestDTO } from '@/zod/auth.zod.js';
import { type FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {
    app.post('/auth/login', {schema: {body: loginSchema}}, async (req, reply) => {
        const responseData = await login(req.body as LoginRequestDTO);

        return reply.status(200).send(responseData);
    });
}