import z from "zod";

const envSchema = z.object({
    HOST: z.string().default('127.0.0.1'),
    PORT: z.coerce.number().default(3333),
    DB_URL: z.url()
});

export const env = envSchema.parse(process.env);