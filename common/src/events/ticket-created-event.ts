import { Subjects } from "./sujects";

export interface ITicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId:string;
    }
}