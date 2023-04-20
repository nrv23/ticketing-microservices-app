import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { OrderStatus } from "@nrvtickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

//jest.mock('../../stripe.ts');

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

it("devolver codigo 201 con valores validos", async () => {

    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = signin(userId);
    const price = Math.floor(Math.random() * 100000)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price,
        userId,
        status: OrderStatus.Created
    });

    await order.save();
    
    await request(app)
        .post(`/api/payments`)
        .set("Cookie",user)
        .send({ 
            token: "tok_visa", 
            orderId: order.id
        })
        
    const stripeCharges = await stripe.charges.list({
        limit: 50
    })

    const stripeCharge = stripeCharges.data.find(charge => charge.amount === (price * 100));

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("usd");

    const payment = await Payment.findOne({
        id: stripeCharge!.id,
        orderId: order.id
    });

    expect(payment).not.toBeNull();
    
})