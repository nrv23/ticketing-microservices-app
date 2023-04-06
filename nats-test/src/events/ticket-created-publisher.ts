import { Publisher } from "./base-publisher";
import { ITicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './sujects';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated;

    
}
