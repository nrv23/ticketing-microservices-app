import request from "supertest";
import { app } from "../../src/app";
import mongoose from 'mongoose';

it("Devolver codigo 404 si el ticket no se encuentra", async () => {

    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/app/tickets/${id}`)
        .send()
        .expect(404);

})

it("retornar el ticket si existe", async () => {

    const response = await request(app)
        .post("/api/tickets/")
        .set('Cookie',signin())
        .send({
            title: "titulo 2",
            price: 20
        })
        .expect(201);


    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual("titulo 2")
    expect(ticketResponse.body.price).toEqual(20)
})