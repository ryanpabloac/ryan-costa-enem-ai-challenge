import { env } from "@/config/env.js";
import { UnauthorizedError } from "@/errors/auth.error.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt, { type JwtPayload } from 'jsonwebtoken';

export function validateToken(req:FastifyRequest): string {
    const authHeader = req.headers.authorization;
    if(!authHeader) throw new UnauthorizedError();

    const token = authHeader.split(' ')[1];
    if(!token) throw new UnauthorizedError();

    try {
        const tokenPayload = jwt.verify(token, env.SECRET) as JwtPayload;
        return tokenPayload.id;
    } catch(error) {
        throw new UnauthorizedError();
    }
}