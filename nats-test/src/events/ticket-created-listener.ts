import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { ITicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './sujects';


export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated; // es solo lectura y typescript se asegura que esta variable no va cambiar su tipo de 
    // dato en un futuro
    queueGroupName = "payments-service";

    onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
        console.log("Event data!",data)

        msg.ack();
    }

}