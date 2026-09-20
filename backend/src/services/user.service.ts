import { UserAlreadyExists } from '@/errors/user.error.js';
import { type CreateUserDTO } from '../zod/user.zod.js';
import { User } from '@/models/user.model.js';
import argon2 from 'argon2';

export async function createUser(userData: CreateUserDTO) {
    if (await User.findOne({ email: userData.email }).exec()) {
        throw new UserAlreadyExists();
    }

    const hashedPassword = await argon2.hash(userData.password);

    const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        targetCourse: userData.targetCourse,
        targetUniversity: userData.targetUniversity,
        weights: userData.weights
    });

    await user.save();
}