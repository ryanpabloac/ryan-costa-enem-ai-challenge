import z from "zod";
import { userSchema } from "./user.zod.js";

export const loginSchema = userSchema.pick({ email:true, password:true});
export type LoginRequestDTO = z.infer<typeof loginSchema>;