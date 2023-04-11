import { Subjects, Listener, ITicketUpdatedEvent } from "@nrvtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGrupoName } from "./queue-group-name";


export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {

    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGrupoName;


    async onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {

        const { id,title, price, version } = data;
        const ticket = await Ticket.findByEvent({id, version});

        if(!ticket) {
            throw new Error("Ticket no encontrado");
        }

        // actualizar las propiedades del ticket 

        ticket.set({
            title, price
        })

        await ticket.save();

        msg.ack();

    }
}