import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env.js";
import type { AreaType, ForeignLanguageType, IQuestion, IAnswer, AlternativeLetter } from "../models/exam.model.js";
import { ExamGenerationError } from "../errors/exam.error.js";
import { generalPrompt, languagePrompt, triPrompt } from "../config/prompt.js";

const genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Helpers
const genAiAlternativeSchema = {
    type: Type.OBJECT,
    properties: {
        letter: {
            type: Type.STRING,
            enum: ["A", "B", "C", "D", "E"]
        },
        text: { type: Type.STRING }
    },
    required: ["letter", "text"]
};

const genAiQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        statement: { type: Type.STRING },
        alternatives: {
            type: Type.ARRAY,
            items: genAiAlternativeSchema
        },
        correctAnswer: {
            type: Type.STRING,
            enum: ["A", "B", "C", "D", "E"]
        },
        explanation: { type: Type.STRING },
        discipline: { type: Type.STRING }
    },
    required: ["statement", "alternatives", "correctAnswer", "explanation", "discipline"]
};

const genAiQuestionsResponseSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: genAiQuestionSchema
        }
    },
    required: ["questions"]
};

function buildQuestionsPrompt(area: AreaType, foreignLanguage?: ForeignLanguageType): string {

    if (area === "linguagens" && foreignLanguage) {
        return languagePrompt(foreignLanguage);
    }

    const disciplineExamples: Record<AreaType, string> = {
        linguagens: "",
        matematica: 'ex: "Álgebra", "Geometria", "Estatística", "Trigonometria", "Funções"',
        natureza: 'ex: "Física", "Química", "Biologia"',
        humanas: 'ex: "História do Brasil", "Geografia", "Filosofia", "Sociologia", "História Mundial"'
    };

    return generalPrompt(area, disciplineExamples[area]);
}

// Main Functions
export async function generateExamQuestions(area: AreaType, foreignLanguage?: ForeignLanguageType): Promise<IQuestion[]> {
    const prompt = buildQuestionsPrompt(area, foreignLanguage);

    try {
        const response = await genai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: genAiQuestionsResponseSchema,
                temperature: 0.8
            }
        });

        const raw = response.text;
        if (!raw) throw new ExamGenerationError();

        const parsed = JSON.parse(raw) as { questions: IQuestion[] };

        if (!Array.isArray(parsed.questions) || parsed.questions.length !== 10) {
            throw new ExamGenerationError();
        }

        return parsed.questions;
    } catch (err) {
        if (err instanceof ExamGenerationError) throw err;
        console.error("[AI] Erro ao gerar questões:", err);
        throw new ExamGenerationError();
    }
}


const triScoreResponseSchema = {
    type: Type.OBJECT,
    properties: {
        triScore: { type: Type.NUMBER },
        reasoning: { type: Type.STRING }
    },
    required: ["triScore", "reasoning"]
};

function buildTriScorePrompt(questions: IQuestion[], answers: IAnswer[]): string {
    const questionsDetails = questions.map((q, i) => {
        const selected = answers[i]?.selectedAnswer;
        const isCorrect = selected === q.correctAnswer;

        return `Questão ${i + 1}: disciplina="${q.discipline}", correta="${q.correctAnswer}", aluno="${selected ?? "não respondida"}", acertou=${isCorrect}`;
    }).join("\n");

    return triPrompt(questionsDetails);
}

export async function calculateTriScore(questions: IQuestion[], answers: IAnswer[])
    : Promise<number> {
    const prompt = buildTriScorePrompt(questions, answers);

    const response = await genai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: triScoreResponseSchema,
            temperature: 0.5
        }
    });

    const raw = response.text;
    if (!raw) return NaN;

    const parsed = JSON.parse(raw) as { triScore: number; reasoning: string };

    return parsed.triScore;
}
