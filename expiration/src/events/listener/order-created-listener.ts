import { Listener, Subjects, OrderCreatedEvent } from "@nrvtickets/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-gruop-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // respuesta en milisegundos 
        console.log("Tiempo de espera en milisegundos", delay)
        // agregar los eventos a la cola de trabajo
        await expirationQueue.add(
            {
                orderId: data.id
            },{
                delay // se configura el tiempo de vencimiento del ticket
            }
        );

        msg.ack();
    }
}