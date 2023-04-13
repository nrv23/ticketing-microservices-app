import { Publisher, ExpirationCompleteEvent, Subjects } from "@nrvtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

}