import mongoose from 'mongoose';
import { ITicketAttrs } from '../interfaces/ITicketAttrs';
import { ITicketDoc } from '../interfaces/ITicketDoc';
import { ITicketModel } from '../interfaces/ITicketModel';

const ticketSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        require: true
    },

    userId: {
        type: String,
        require: true
    }
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: ITicketAttrs) => {

    return new Ticket(attrs);
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket',ticketSchema);

export { Ticket };