import { Publisher, Subjects, ITicketUpdatedEvent } from "@nrvtickets/common";


export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {

    readonly subject = Subjects.TicketUpdated;
}