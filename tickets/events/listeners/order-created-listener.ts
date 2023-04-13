import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@nrvtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publiser';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {

            throw new Error("Ticket no encontrado");
        }

        // se asgina el orderid para bloquear el ticket 

        ticket.set({
            orderId: data.id
        });

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }

}