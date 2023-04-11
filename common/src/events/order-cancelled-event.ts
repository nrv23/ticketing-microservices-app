import { Subjects } from "./sujects";


export interface OrderCancelledEvent {
    
    subject: Subjects.OrderCancelled
    data: {
        id: string; // id de la orden a cancelar
        version: number;
        ticket: {
            id: string;
        }
    }
    
}