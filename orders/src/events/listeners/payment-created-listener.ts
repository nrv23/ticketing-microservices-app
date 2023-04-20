import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from "@nrvtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGrupoName } from "./queue-group-name";



export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    //queueGroupName: string;

    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGrupoName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {

        const { id, orderId, stripeId  } = data;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new Error("Orden no encontrada");
        }

        order!.set({
            status: OrderStatus.Complete
        })

        await order.save();

        msg.ack();
    }
}