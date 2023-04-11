import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; // para actualizar la version del documento en mongodb


interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}


export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}



interface TicketModel extends mongoose.Model<TicketDoc> {

    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
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

// cambiar el nombre de la propiedad __v en mongodb

ticketSchema.set("versionKey","version");

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {

    return new Ticket({
        _id: attrs.id, // asignar el id generado del ticket service en el order service y tener consistencia en los datos
        title: attrs.title,
        price: attrs.price,
    });
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {

    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1 // validar la version del documento. Esto con el fin de ejecutar eventos en orden secuencial
    });
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