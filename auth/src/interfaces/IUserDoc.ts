import mongoose from 'mongoose';
export interface IUserDoc extends mongoose.Document {
    email: string;
    password: string;
}