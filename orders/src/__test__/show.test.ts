import request from 'supertest';
import { app } from '../app';
import { Ticket } from '../models/ticket';


it("Listar la orden", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const user1 = signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: FecthedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user1)
        .send()
        .expect(200);

    expect(FecthedOrder.id).toEqual(order.id);
})




it("Retorna error si un usuario intenta obtener ordenes de otro usuario", async () => {

    const ticket = Ticket.build({
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const user1 = signin();
    const user2 = signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user1)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: FecthedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user2)
        .send()
        .expect(401);

})