import z from "zod";

export const createExamSchema = z.object({
    area: z.enum(["linguagens", "matematica", "natureza", "humanas"],
        "A área deve ser: linguagens, matematica, natureza ou humanas"),
    foreignLanguage: z.enum(["ingles", "espanhol"]).optional()
}).refine((data) => !(data.area === "linguagens" && !data.foreignLanguage), {
    message: "O idioma da língua estrangeira é obrigatório para a área de linguagens",
    path: ["foreignLanguage"]
});

export type CreateExamDTO = z.infer<typeof createExamSchema>;

export const submitAnswersSchema = z.object({
    answers: z.array(
        z.object({
            questionIndex: z.number().int().min(0).max(9),
            selectedAnswer: z.enum(["A", "B", "C", "D", "E"])
        })
    ).min(1).max(10)
});

export type SubmitAnswersDTO = z.infer<typeof submitAnswersSchema>;
