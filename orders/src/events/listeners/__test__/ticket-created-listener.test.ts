import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import { ITicketCreatedEvent } from '@nrvtickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';



const setup = async () => {

    const listener = new TicketCreatedListener(natsWrapper.client);

    const data : ITicketCreatedEvent["data"] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return {listener, data, msg};
}

it("Crear y registrar tickets", async() => {

    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined(); 
    expect(ticket!.title).toEqual(data.title);
})

it("marcar evento como procesado exitosamente", async() => {


    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})