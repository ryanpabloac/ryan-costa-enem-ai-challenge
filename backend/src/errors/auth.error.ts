import { AppError } from "./app.error.js";

export class InvalidCredencials extends AppError {

    constructor() {
        super({
            title: 'Email e/ou senha incorreto(s)',
            status: 400,
            detail: "Email e/ou senha incorreto(s). Confira as credenciais e relaize o login novamente"
        });
    }
}