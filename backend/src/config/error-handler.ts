import { UserAlreadyExists } from "../errors/user.error.js";
import type { FastifyInstance } from "fastify";


export const errorHandler: FastifyInstance["errorHandler"] = (error, req, rep) => {
    if (error instanceof UserAlreadyExists) {
        return rep.status(409).send({
            ...error.toProblemDetail(),
            instance: req.url
        });
    }
}  