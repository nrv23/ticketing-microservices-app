import mongoose from 'mongoose';
import { IUser } from './IUser';
import { IUserDoc } from './IUserDoc';

export interface IUserModel extends mongoose.Model<IUserDoc> {
    build(user: IUser): IUserDoc;
}