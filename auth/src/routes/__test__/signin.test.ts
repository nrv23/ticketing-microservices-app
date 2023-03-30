import request from 'supertest';
import app from '../../app';

it("Devolver codigo 400 por email que no existe", async () => {

    return request(app)
        .post("/api/users/signin")
        .send({
            "email": "nrv23911@gmail.com",
            "password": "nvm231191"
        })
        .expect(400)
})

it("Devolver codigo 400 por password inválido", async () => {

    await  signin();

    await request(app)
        .post("/api/users/signin")
        .send({
            "email": "nrv2391@gmail.com",
            "password": ""
        })
        .expect(400)

})

it("Devolver cookie por login exitoso", async () => {

   const cookie = await  signin();

    expect(cookie).toBeDefined();        
        
})
