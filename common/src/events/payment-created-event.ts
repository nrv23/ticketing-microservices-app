
import { Subjects } from './sujects';


export interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated;
    data: {
        id: string; // este es el id de la coleccion de payments
        orderId: string;
        stripeId: string;
    }
} 