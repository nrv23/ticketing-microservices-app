import request from "supertest";
import { app } from "../../src/app";

const createTicket = () => {

    return  request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title: "titulo 2",
        price: 20
    });
}

it("Listar los tickets", async () => {

    await createTicket();
    await createTicket();
    await createTicket();

    
    const response = await request(app)
        .get("/api/tickets/")
        .set('Cookie', signin())
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
})