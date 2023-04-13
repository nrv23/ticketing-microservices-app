import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';


it("retorna error si el ticket no existe", async () => {

    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post(`/api/orders/`)
        .set("Cookie",signin())
        .send({ ticketId })
        .expect(404);

})

it("retorna error si el ticket ya está reservado", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "2sdds2342asfsdf",
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();

    await request(app)
    .post(`/api/orders/`)
    .set("Cookie",signin())
    .send({
        ticketId: ticket.id 
    })
    .expect(400);
});


it("reserva un ticket", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    await request(app)
    .post(`/api/orders/`)
    .set("Cookie",signin())
    .send({
        ticketId: ticket.id 
    })
    .expect(201);
})

it("emitir un evento cuando se crea una orden", async () => {


    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    await request(app)
    .post(`/api/orders/`)
    .set("Cookie",signin())
    .send({
        ticketId: ticket.id 
    })
    .expect(201);


    expect(natsWrapper.client.publish).toHaveBeenCalled();

})