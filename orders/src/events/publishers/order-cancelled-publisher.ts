import { Publisher, OrderCancelledEvent, Subjects } from "@nrvtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}