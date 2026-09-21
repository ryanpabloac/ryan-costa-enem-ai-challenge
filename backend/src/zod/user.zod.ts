import { z } from 'zod';

export const userSchema = z.object({
    name: z.string("Nome é obrigatório").min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.email("Email inválido"),
    password: z.string("Senha é obrigatória").min(8, "Senha deve ter no mínimo 8 caracteres"),
    targetCourse: z.string().optional(),
    targetUniversity: z.string().optional(),
    weights: z.object({
        humanities: z.coerce.number().positive().default(1).optional(),
        mathematics: z.coerce.number().positive().default(1).optional(),
        science: z.coerce.number().positive().default(1).optional(),
        language: z.coerce.number().positive().default(1).optional(),
        essay: z.coerce.number().positive().default(1).optional(),
    }).optional()
});

export const createUserSchema = userSchema.extend({
    confirmPassword: z.string("Confirmação de senha é obrigatória").min(8, "Confirmação de senha deve ter no mínimo 8 caracteres"),
}).refine((data) => data.password == data.confirmPassword, {
    message: "Senhas não coincidem",
    path:['confirmPassword']
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;