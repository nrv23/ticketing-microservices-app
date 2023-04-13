import { Subjects } from "./sujects";

export interface ExpirationCompleteEvent {

    subject: Subjects.ExpirationComplete;
    data: {
        orderId: string;
    }
}