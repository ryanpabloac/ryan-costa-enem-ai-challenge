import type { FastifyInstance } from "fastify";
import { validateToken } from "../middlewares/auth.middleware.js";
import { createExam, getExam, listUserExams, submitAnswers } from "../services/exam.service.js";
import { createExamSchema, submitAnswersSchema } from "../zod/exam.zod.js";
import type { CreateExamDTO, SubmitAnswersDTO } from "../zod/exam.zod.js";

export async function examRoutes(app: FastifyInstance) {

    app.post('/exams', { schema: { body: createExamSchema } }, async (req, reply) => {
        const userId = validateToken(req);

        const result = await createExam(
            userId,
            req.body as CreateExamDTO
        );

        console.log('3 - createExam terminou');
        console.log(result);

        return reply.status(201).send(result);
    });

    app.get("/exams", async (req, reply) => {
        const userId = validateToken(req);

        const exams = await listUserExams(userId);
        return reply.status(200).send(exams);
    });

    app.get("/exams/:id", async (req, reply) => {
        const userId = validateToken(req);

        const { id } = req.params as { id: string };

        const exam = await getExam(id, userId);
        return reply.status(200).send(exam);
    });

    app.post("/exams/:id/submit", { schema: { body: submitAnswersSchema } }, async (req, reply) => {
        const userId = validateToken(req);
        const { id } = req.params as { id: string };

        const result = await submitAnswers(id, userId, req.body as SubmitAnswersDTO);
        return reply.status(200).send(result);
    });
}