import { Publisher, Subjects, ITicketCreatedEvent } from "@nrvtickets/common";


export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated;
}