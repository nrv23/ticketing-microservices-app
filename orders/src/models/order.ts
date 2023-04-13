import { OrderStatus } from '@nrvtickets/common';
import mongoose from 'mongoose';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


export { OrderStatus };

interface orderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: orderAttrs): OrderDoc; 
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus), // validar que un campo tenga forzosamente los campos de un enum
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },

    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
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

orderSchema.set("versionKey","version");

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: orderAttrs) => {
    
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);


export { Order };