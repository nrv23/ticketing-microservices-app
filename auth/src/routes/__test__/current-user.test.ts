import request from 'supertest';
import app from '../../app';

it("Devolver detalles de un usuario logueado", async () => {


    const cookie = await signin();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie",cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("nrv2391@gmail.com")
});

it("Responder con null si no esta autenticado", async () => {
    const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
})