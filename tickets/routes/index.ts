import { Router, Request, Response } from 'express';
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets/", async (req: Request, res: Response) => {

    const tickets = await Ticket.find({ // traer los tickets que no tengan una orden asociada
        orderId: undefined
    });
    return res.status(200).send(tickets);
})

export { router as indexTicketRouter };