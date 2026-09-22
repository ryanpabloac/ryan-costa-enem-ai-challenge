import { AppError } from "./app.error.js";

export class ExamNotFoundError extends AppError {
    constructor() {
        super({
            title: "Simulado não encontrado",
            status: 404,
            detail: "O simulado informado não existe ou não foi encontrado."
        });
    }
}

export class ExamForbiddenError extends AppError {
    constructor() {
        super({
            title: "Acesso negado",
            status: 403,
            detail: "Você não tem permissão para acessar este simulado."
        });
    }
}

export class ExamAlreadyCompletedError extends AppError {
    constructor() {
        super({
            title: "Simulado já concluído",
            status: 409,
            detail: "Este simulado já foi finalizado e não pode ser submetido novamente."
        });
    }
}

export class InvalidAnswerError extends AppError {
    constructor(detail: string) {
        super({
            title: "Resposta inválida",
            status: 400,
            detail
        });
    }
}

export class ExamGenerationError extends AppError {
    constructor() {
        super({
            title: "Erro ao gerar simulado",
            status: 502,
            detail: "Não foi possível gerar as questões do simulado. Tente novamente em instantes."
        });
    }
}
