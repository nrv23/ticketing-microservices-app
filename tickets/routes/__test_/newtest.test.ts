import request from "supertest";
import { app } from "../../src/app";

it("Hay una ruta escuchando a /api/tickets para peticiones post", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(400);
});

it("Puede tener acceso si el usuario esta logueado", async () => {
    const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("Devolver otro estado a 401 si el usuario esta logueado", async () => { 

    const cookie = global.signin();

    console.log({cookie});
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});
    console.log({response: response.status})
    expect(response.status).not.toEqual(401);
});
it("retorna error si se envia un titulo inválido", async () => { });
it("Retorna error si se envía un precio inválido", async () => { });
it("Crea un ticket con la información correcta.", async () => { });
