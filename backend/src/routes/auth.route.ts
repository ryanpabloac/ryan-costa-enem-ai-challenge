import { validateToken } from '../middlewares/auth.middleware.js';
import { login } from '../services/auth.service.js';
import { getUser } from '../services/user.service.js';
import { loginSchema, type LoginRequestDTO } from '../zod/auth.zod.js';
import { type FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {
    app.post('/auth/login', {schema: {body: loginSchema}}, async (req, reply) => {
        const responseData = await login(req.body as LoginRequestDTO);

        return reply.status(200).send({ token: responseData });
    });

    app.get('/auth/me', async (req, reply) => {
        const userId = validateToken(req);
        const userData = await getUser(userId);

        return reply.status(200).send(userData);
    });
}