import { OrderStatus } from '@nrvtickets/common';
import request from 'supertest';
import { app } from '../app';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
it("Marcar una orden como cancelada", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const user1 = signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user1)
        .send()
        .expect(204);

    // obtener y validar el estado de la orden


    const { body: updatedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user1)
        .send()
        .expect(200);
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
})
it("Emitir un evento de orden cancelada", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const user1 = signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user1)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})