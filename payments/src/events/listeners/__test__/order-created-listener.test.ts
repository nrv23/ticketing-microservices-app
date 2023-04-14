import { OrderCreatedListener } from './../order-created-listener';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@nrvtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';



const setup = async () => {

    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version:0,
        status: OrderStatus.Created,
        userId: "asdsas",
        expiresAt: new Date().toISOString(),
        ticket: {
            id: "sadass",
            price: 10,
        }
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return { listener, data, msg };
};

it("Replicar la informacion de la orden", async () => {

    const { listener, data, msg } = await setup();
    await listener.onMessage(data,msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it("Marcar el evento como procesado correctamente", async () => {

    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})

