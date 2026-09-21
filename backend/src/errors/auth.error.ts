import { AppError } from "./app.error.js";

export class InvalidCredencials extends AppError {

    constructor() {
        super({
            title: 'Email e/ou senha incorreto(s)',
            status: 400,
            detail: "Email e/ou senha incorreto(s). Confira as credenciais e realize o login novamente"
        });
    }
}

export class UnauthorizedError extends AppError {

    constructor() {
        super({
            title: 'Acesso Negado',
            status: 401,
            detail: "Usuário não autorizado a acessar essa rota"
        });
    }
}