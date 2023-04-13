import mongoose from 'mongoose';
import { ITicketAttrs } from '../interfaces/ITicketAttrs';
import { ITicketDoc } from '../interfaces/ITicketDoc';
import { ITicketModel } from '../interfaces/ITicketModel';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; // para actualizar la version del documento en mongodb

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
    },
    orderId: {
      type: String
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

// cambiar el nombre de la propiedad __v en mongodb

ticketSchema.set("versionKey","version");

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicketAttrs) => {

    return new Ticket(attrs);
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket',ticketSchema);

export { Ticket };