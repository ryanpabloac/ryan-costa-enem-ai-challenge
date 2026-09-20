import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    targetCourse: String,
    targetUniversity: String,
    weights: {
        humanities: { type: Number, default: 1 },
        mathematics: { type: Number, default: 1 },
        science: { type: Number, default: 1 },
        language: { type: Number, default: 1 },
        essay: { type: Number, default: 1 },
    }
});

export const User = mongoose.model('User', userSchema);