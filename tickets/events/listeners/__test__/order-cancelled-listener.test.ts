import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../src/nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent, OrderStatus } from '@nrvtickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';



const setup = async () => {

    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "3423423"
    });

    ticket.set({
        orderId
    });

    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version:0,
        ticket: {
            id: ticket.id,
        }
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
};



it("actualizar el ticket, publicar un evento y marcar el evento como procesado", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

