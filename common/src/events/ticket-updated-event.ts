import { Subjects } from "./sujects";

export interface ITicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId:string;
    }
}