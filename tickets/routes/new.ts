import { requireAuth, validateRequest } from '@nrvtickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../src/nats-wrapper';



const router = Router();

router.post("/api/tickets", requireAuth, [
    body("title").not().isEmpty().withMessage("Titulo es requerido"),
    body("price").isFloat({ gt: 0 }).withMessage("Precio inválido"),
], validateRequest, async (req: Request, res: Response) => {

    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();

    console.log("Guardó el ticket");

    // publicar un evento

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })


    res.status(201).send(ticket);
})

export { router as createTicketRouter };