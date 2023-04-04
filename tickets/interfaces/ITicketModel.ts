import mongoose from 'mongoose';
import { ITicketDoc } from './ITicketDoc';
import { ITicketAttrs } from './ITicketAttrs';

export interface ITicketModel extends mongoose.Model<ITicketDoc>{
    build(attrs: ITicketAttrs): ITicketDoc; 
}