import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@nrvtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGrupoName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {

    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGrupoName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {

        const order = await Order.findById(data.orderId).populate("ticket");

        if(!order) {
            throw new Error("Orden no encontrada");
        }

        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    }
}