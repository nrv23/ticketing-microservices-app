import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../src/app";
import { natsWrapper } from '../../src/nats-wrapper';


it("Hay una ruta escuchando a /api/tickets para peticiones post", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(400);
});

it("Puede tener acceso si el usuario esta logueado", async () => {
    const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("Devolver otro estado a 401 si el usuario esta logueado", async () => { 

    const cookie = global.signin();

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});
    expect(response.status).not.toEqual(401);
});

it("retorna error si se envia un titulo inválido", async () => { 
    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        title: "",
        price: 10
    })
    .expect(400);

    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        price: 10
    })
    .expect(400);
});

it("Retorna error si se envía un precio inválido", async () => {

    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        title: "titulo 1",
        price: ""
    })
    .expect(400);

    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        title: "titulo 1",
    })
    .expect(400);
 });
it("Crea un ticket con la información correcta.", async () => { 

    // agregar bandera para asegurar que el ticket fue guardado en la bd

    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        title: "titulo 1",
        price: 10
    })
    .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);

});

it("Puclishes an event", async () => {


    await request(app)
    .post("/api/tickets")
    .set("Cookie",signin())
    .send({
        title: "titulo 1",
        price: 10
    })
    .expect(201);


    expect(natsWrapper.client.publish).toHaveBeenCalled();

})