import { ITicketUpdatedEvent } from '@nrvtickets/common';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {

    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 10,
    });

    await ticket.save();


    const data : ITicketUpdatedEvent["data"] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: "new concert",
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket};
}

it("encontrar, actualizar y guardar un ticket", async () => {

    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);


    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

})

it("Marcar como evento procesado exitosamente", async () => {

    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data,msg);


    expect(msg.ack).toHaveBeenCalled();

})


it("No se marca como procesado el evento si el evento no corresponde con la version", async () => {

    const {listener, data, msg, ticket} = await setup();

    data.version = 10; // como tiene una version superior y no se secuencial, la funcion ack no debe llamarse.

    try {
        
        await listener.onMessage(data,msg);

    } catch (error) {


    }

    expect(msg.ack).not.toHaveBeenCalled();
})