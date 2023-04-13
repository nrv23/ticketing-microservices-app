import { ExpirationCompleteEvent, OrderStatus } from '@nrvtickets/common';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import  mongoose from 'mongoose';

const setup = async () => {

    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 10,
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: "qrqq43",
        expiresAt: new Date(),
        ticket
    })

    await order.save();


    const data : ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket, order};
}

it("Actualizar el estado de la orden a cancelada ", async () => {

    const {listener, data, msg, ticket, order} = await setup();
    await listener.onMessage(data, msg);

    const orderUpdated = await Order.findById(order.id);    

    expect(orderUpdated!.status).toEqual(OrderStatus.Cancelled);
});

it("Emitit el evento de orden cancelada", async () => {

    const {listener, data, msg, ticket, order} = await setup();
    await listener.onMessage(data, msg);

    // espera que la funcion publish sea invocada
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const mock = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]); // esto devuelve lo que la publish publica en el evento
    // comparar que los paraemtros que se publicaron de la orden, sean igual a la orden que se creo
    expect(mock.id).toEqual(order.id);
})

it("Marcar el evento como completado", async () => {

    const {listener, data, msg, ticket, order} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})