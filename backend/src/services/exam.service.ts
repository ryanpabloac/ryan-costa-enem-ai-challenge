import mongoose from "mongoose";
import { Exam, type AreaType, type ForeignLanguageType, type IQuestion } from "../models/exam.model.js";
import { generateExamQuestions, calculateTriScore } from "./ai.service.js";
import { ExamNotFoundError, ExamForbiddenError, ExamAlreadyCompletedError, InvalidAnswerError } from "../errors/exam.error.js";
import type { CreateExamDTO, SubmitAnswersDTO } from "../zod/exam.zod.js";

function sanitizeQuestions(questions: IQuestion[]) {
    return questions.map(({ statement, alternatives, discipline }) => ({
        statement,
        alternatives,
        discipline
    }));
}

export async function createExam(userId: string, data: CreateExamDTO) {
    const questions = await generateExamQuestions(data.area, data.foreignLanguage);

    const newExam = new Exam({
        userId: new mongoose.Types.ObjectId(userId),
        area: data.area,
        questions,
        answers: [],
        status: "IN_PROGRESS"
    });

    if (data.foreignLanguage) newExam.foreignLanguage = data.foreignLanguage;

    await newExam.save();

    return {
        id: newExam._id.toString(),
        area: newExam.area,
        foreignLanguage: newExam.foreignLanguage,
        status: newExam.status,
        createdAt: newExam.createdAt,
        questions: sanitizeQuestions(questions)
    };
}

export async function getExam(id: string, userId: string) {
    if (!mongoose.isValidObjectId(id)) throw new ExamNotFoundError();

    const exam = await Exam.findById(id).lean();
    if (!exam) throw new ExamNotFoundError();
    if (exam.userId.toString() !== userId) throw new ExamForbiddenError();

    const isCompleted = exam.status === "COMPLETED";

    return {
        id: exam._id.toString(),
        area: exam.area,
        foreignLanguage: exam.foreignLanguage,
        status: exam.status,
        createdAt: exam.createdAt,
        answers: exam.answers,
        result: exam.result,
        questions: isCompleted
            ? exam.questions.map((q) => ({
                statement: q.statement,
                alternatives: q.alternatives,
                discipline: q.discipline,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation
            }))
            : sanitizeQuestions(exam.questions)
    };
}

export async function listUserExams(userId: string) {
    if (!mongoose.isValidObjectId(userId)) return [];

    const exams = await Exam.find({ userId: new mongoose.Types.ObjectId(userId) })
        .select("-questions -answers")
        .sort({ createdAt: -1 })
        .lean();

    return exams.map((exam) => ({
        id: exam._id.toString(),
        area: exam.area,
        foreignLanguage: exam.foreignLanguage,
        status: exam.status,
        result: exam.result,
        createdAt: exam.createdAt
    }));
}

export async function submitAnswers(id: string, userId: string, dto: SubmitAnswersDTO) {
    if (!mongoose.isValidObjectId(id)) throw new ExamNotFoundError();

    const exam = await Exam.findById(id);
    if (!exam) throw new ExamNotFoundError();
    if (exam.userId.toString() !== userId) throw new ExamForbiddenError();
    if (exam.status === "COMPLETED") throw new ExamAlreadyCompletedError();

    for (const ans of dto.answers) {
        if (ans.questionIndex < 0 || ans.questionIndex >= exam.questions.length) {
            throw new InvalidAnswerError(
                `Índice de questão inválido: ${ans.questionIndex}. O simulado possui ${exam.questions.length} questões (0–${exam.questions.length - 1}).`
            );
        }
    }

    exam.answers = dto.answers.map((a) => ({
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer
    }));

    const totalQuestions = exam.questions.length;
    const correctCount = exam.questions.filter((q, i) =>
        exam.answers.find((a) => a.questionIndex === i)?.selectedAnswer === q.correctAnswer
    ).length;
    const wrongCount = totalQuestions - correctCount;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const triScore = await calculateTriScore(exam.questions, exam.answers);

    exam.status = "COMPLETED";
    exam.result = { totalQuestions, correctCount, wrongCount, scorePercentage, triScore };

    await exam.save();

    return {
        id: exam._id.toString(),
        area: exam.area,
        foreignLanguage: exam.foreignLanguage,
        status: exam.status,
        result: exam.result,
        createdAt: exam.createdAt,
        questions: exam.questions.map((q, i) => ({
            index: i,
            statement: q.statement,
            alternatives: q.alternatives,
            discipline: q.discipline,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            selectedAnswer: exam.answers
        }))
    };
}
