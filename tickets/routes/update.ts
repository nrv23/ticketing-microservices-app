import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@nrvtickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';


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

    // valida que el ticket sea del usuario actual 

    if(ticket.userId !== req.currentUser!.id) {

        throw new NotAuthorizedError();
    }

    ticket.set({
        title, price
    })

    await ticket.save();

    res.send(ticket);
})

export { router as updateTicketRouter };