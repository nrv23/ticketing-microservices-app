import request from 'supertest';
import app from '../../app';

it("Devolver codigo 201 como registro exitoso", async () => {

    await  signin();
})

it("Devolver codigo 400 por email inválido", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            "email": "nrv2391@gmail.",
            "password": "nvm231191"
        })
        .expect(400)
})


it("Devolver codigo 400 por password inválido", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            "email": "nrv2391@gmail.",
            "password": "nv1"
        })
        .expect(400)
})


it("Devolver codigo 400 por no enviar ningun parametro en el body", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({

        })
        .expect(400)
});

it("No debe permitir registrar correos duplicados", async () => {

    await  signin();

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "nrv2391@gmail.com",
            password: "nvm231191"
        })
        .expect(400)
})

it("Devolver un cookie despues de un registro existoso", async () => {

    const cookie = await  signin();
    
    expect(cookie).toBeDefined() // comprobar devuelve el cookie que contiene el token 
})