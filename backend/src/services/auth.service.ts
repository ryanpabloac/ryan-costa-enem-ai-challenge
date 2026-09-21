import { env } from "../config/env.js";
import { InvalidCredencials } from "../errors/auth.error.js";
import { User } from "../models/user.model.js";
import { type LoginRequestDTO } from "../zod/auth.zod.js";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export async function login(loginData:LoginRequestDTO): Promise<string> {
    const userData = await User.findOne({email: loginData.email}).exec();
    if(!userData) throw new InvalidCredencials();

    const isPasswordCorrect = await argon2.verify(userData.password, loginData.password);
    if(!isPasswordCorrect) throw new InvalidCredencials();

    const token = jwt.sign({
        id: userData._id
    }, env.SECRET);

    return token;
}