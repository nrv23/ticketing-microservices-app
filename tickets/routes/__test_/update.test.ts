import request from "supertest";
import { app } from "../../src/app";
import mongoose from 'mongoose';

it("devolver codigo 404 si el id del ticket no existe", async () => {

    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signin())
        .send({
            title: "sdsdf",
            price: 4
        })
        .expect(404);
})

it("Devolver codigo 401 si el usuario no está logueado", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "sdsdf",
            price: 4
        })
        .expect(401);
});

it("Devolver codigo 401 si el usuario no es el dueño del ticket", async () => {

    const response = await request(app)
        .post(`/api/tickets/`)
        .set("Cookie", signin())
        .send({
            title: "sdsdf",
            price: 4
        });


    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signin())
        .send({
            title: "hola",
            price: 5
        })
        .expect(401);

});

it("Devolver codigo 400 si titulo o precio son invalidos", async () => {

    const cookie = signin();
    const response = await request(app)
        .post(`/api/tickets/`)
        .set("Cookie", cookie)
        .send({
            title: "sdsdf",
            price: 4
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "hola",
            price: ""
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 4
        })
        .expect(400);
});

it("Actualizar ticket con información correcta", async () => {

    const cookie = signin();
    const response = await request(app)
        .post(`/api/tickets/`)
        .set("Cookie", cookie)
        .send({
            title: "sdsdf",
            price: 4
        });

    const ticketResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new Title",
            price: 200
        })
        .expect(200);


    expect(ticketResponse.body.title).toEqual("new Title");
    expect(ticketResponse.body.price).toEqual(200);
});