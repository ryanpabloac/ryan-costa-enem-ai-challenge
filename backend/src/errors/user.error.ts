import { AppError } from "./app.error.js";

export class UserAlreadyExists extends AppError {

    constructor() {
        super({
            title: 'Email já cadastrado',
            status: 409,
            detail: 'Um usuário já registrou uma conta com esse email'
        });
    }
}