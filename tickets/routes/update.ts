import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@nrvtickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publiser';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../src/nats-wrapper';


const router = Router();

router.put('/api/tickets/:id', requireAuth,[
    body("title").not().isEmpty().withMessage("Titulo es requerido"),
    body("price").isFloat({ gt: 0 }).withMessage("Precio inválido"), 
],requireAuth, validateRequest,async (req: Request, res: Response) => {

    const { id } = req.params;
    const { title,price } = req.body;
    const ticket = await Ticket.findById(id);

    if(!ticket) {
        throw new NotFoundError();
    }

    //validar que el ticket no esta reservado

    if(ticket.orderId) { // el ticket ya esta reservado
        throw new BadRequestError("El ticket ya está reservado");
    }

    // valida que el ticket sea del usuario actual 

    if(ticket.userId !== req.currentUser!.id) {

        throw new NotAuthorizedError();
    }

    



    ticket.set({
        title, price
    })

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.send(ticket);
})

export { router as updateTicketRouter };