
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@nrvtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled-listener';



const setup = async () => {

    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString()
    });


    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: "adfadf"
        }
        
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return { listener, data, msg, order };
};

it("Cancelar la orden", async () => {

    const { listener, data, msg,order } = await setup();
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Marcar el evento como procesado correctamente", async () => {

    const { listener, data, msg,order } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})

