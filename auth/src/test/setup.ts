import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';


declare global { // implementar funciones en la variable global para ser extendible en cualquier parte de la aplicacion

    var signin: () => Promise<string[]>;
}


let mongo: any;

beforeAll(async () => {
    process.env.JWT_SECRET = "asdsdasd";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (const coll of collections) {

        await coll.deleteMany({});
    }

})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = async () => {

    const email = "nrv2391@gmail.com";
    const password = "nvm231191";

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
}