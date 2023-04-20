import { Publisher, Subjects, PaymentCreatedEvent } from "@nrvtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}