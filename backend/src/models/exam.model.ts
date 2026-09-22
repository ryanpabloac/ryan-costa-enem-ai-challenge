import mongoose, { type Document, type Types } from "mongoose";

export type AreaType = "linguagens" | "matematica" | "natureza" | "humanas";
export type ForeignLanguageType = "ingles" | "espanhol";
export type AlternativeLetter = "A" | "B" | "C" | "D" | "E";
export type ExamStatus = "IN_PROGRESS" | "COMPLETED";

export interface IAlternative {
    letter: AlternativeLetter;
    text: string;
}

export interface IQuestion {
    statement: string;
    alternatives: IAlternative[];
    correctAnswer: AlternativeLetter;
    explanation: string;
    discipline: string;
}

export interface IAnswer {
    questionIndex: number;
    selectedAnswer: AlternativeLetter;
}

export interface IExamResult {
    totalQuestions: number;
    correctCount: number;
    wrongCount: number;
    scorePercentage: number;
    triScore: number;
}

export interface IExam extends Document {
    userId: Types.ObjectId;
    area: AreaType;
    foreignLanguage?: ForeignLanguageType;
    questions: IQuestion[];
    answers: IAnswer[];
    status: ExamStatus;
    result?: IExamResult;
    createdAt: Date;
    updatedAt: Date;
}

const alternativeSchema = new mongoose.Schema<IAlternative>(
    {
        letter: {
            type: String,
            enum: ["A", "B", "C", "D", "E"],
            required: true
        },
        text: { type: String, required: true }
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema<IQuestion>(
    {
        statement: { type: String, required: true },
        alternatives: { type: [alternativeSchema], required: true },
        correctAnswer: {
            type: String,
            enum: ["A", "B", "C", "D", "E"],
            required: true
        },
        explanation: { type: String, required: true },
        discipline: { type: String, required: true }
    },
    { _id: false }
);

const answerSchema = new mongoose.Schema<IAnswer>(
    {
        questionIndex: { type: Number, required: true },
        selectedAnswer: {
            type: String,
            enum: ["A", "B", "C", "D", "E"],
            required: true
        }
    },
    { _id: false }
);

const examResultSchema = new mongoose.Schema<IExamResult>(
    {
        totalQuestions: { type: Number, required: true },
        correctCount: { type: Number, required: true },
        wrongCount: { type: Number, required: true },
        scorePercentage: { type: Number, required: true },
        triScore: { type: Number, required: true }
    },
    { _id: false }
);

const ExamSchema = new mongoose.Schema<IExam>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        area: {
            type: String,
            enum: ["linguagens", "matematica", "natureza", "humanas"],
            required: true
        },
        foreignLanguage: {
            type: String,
            enum: ["ingles", "espanhol"]
        },
        questions: { type: [questionSchema], required: true },
        answers: { type: [answerSchema], default: [] },
        status: {
            type: String,
            enum: ["IN_PROGRESS", "COMPLETED"],
            default: "IN_PROGRESS"
        },
        result: { type: examResultSchema }
    },
    { timestamps: true }
);

export const Exam = mongoose.model<IExam>("Exam", ExamSchema);
