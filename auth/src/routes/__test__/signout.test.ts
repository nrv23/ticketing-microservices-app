import request from 'supertest';
import app from '../../app';


it("Limpiar las cookies despues de cerrar sesion", async () => {

    await  signin();

    await request(app)
        .post("/api/users/signin")
        .send({
            "email": "nrv2391@gmail.com",
            "password": "nvm231191"
        })
        .expect(200);

    const response = await request(app)
        .post("/api/users/signin")
        .send({ });

    
    expect(typeof response.get("Set-Cookie") === "undefined");
})