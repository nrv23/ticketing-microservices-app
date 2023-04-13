import { OrderCreatedListener } from './../order-created-listener';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../src/nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@nrvtickets/common';



const setup = async () => {

    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "3423423"
    });

    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version:0,
        status: OrderStatus.Created,
        userId: ticket.userId,
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
};

it("setear el userid en el ticket", async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

    
});

it("Marcar el evento como procesado correctamente", async () => {

    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})

it("publicar un evento de actualizar ticket", async () => {

    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    // verificar que se estan enviando bien los parametros de la funcion publish
    const ticketUpdatedData =JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})