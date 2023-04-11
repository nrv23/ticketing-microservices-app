import { Subjects, Listener, ITicketCreatedEvent } from "@nrvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGrupoName } from "./queue-group-name";


export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGrupoName;

    async onMessage(data: ITicketCreatedEvent["data"], msg: Message) {

        const { id,title, price } = data;
        const ticket = Ticket.build({
            title, price, id
        });

        await ticket.save();

        msg.ack();
    }
}