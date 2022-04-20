import { Schema, model } from 'mongoose';

interface IUser {
    username: string;
    email: string;
    tokens: number;
    role: string;
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    tokens: {type: Number, required: true, default: 50},
    role: {type: String, required: true, default: 'User'}
});

export const User = model<IUser>('User', userSchema);
