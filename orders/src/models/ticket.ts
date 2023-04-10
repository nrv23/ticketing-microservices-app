import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
    title: string;
    price: number;
}


export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;

    isReserved(): Promise<boolean>;
}



interface TicketModel extends mongoose.Model<TicketDoc> {

    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0 // el precio siempre debe ser positivo
    }
}, {
    toJSON: {
        transform(doc, ret) {

            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {

    return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function () {
    // usar keyword function para usar la palabra reservada this y poder tener el contexto del documento para consultar.
    // en una funcion de flecha no es posible.

    const existingOrder = await Order.findOne({ // si esta consulta devuelve algo, qiuoere decir que el ticket ya esta reservado
        ticket: this, // this representa el contexto del documento actual que esta llamando la funcion
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };