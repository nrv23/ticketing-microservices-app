import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { OrderStatus } from "@nrvtickets/common";

it("Retornar codigo 404 si la orden no existe", async () => {

    const response = await request(app).post(`/api/payments/`)
        .set("Cookie",signin())
        .send({ 
            token: "asdsadsasad", 
            orderId: new mongoose.Types.ObjectId().toHexString()  
        })
        .expect(404);

})

it("Devolver codigo 401 si la orden no pertece al usuario actual", async () => {

    const user = signin();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Complete
    });

    await order.save();

    await request(app).post(`/api/payments/`)
    .set("Cookie",user)
    .send({ 
        token: "asdsadsasad", 
        orderId: order.id
    })
    .expect(401);

})


it("Devolver codigo 400 si la orden tiene estado cancelado", async () => {

    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        userId,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app).post(`/api/payments/`)
    .set("Cookie",user)
    .send({ 
        token: "asdsadsasad", 
        orderId: order.id
    })
    .expect(400);
})
