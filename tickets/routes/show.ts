import { NotFoundError } from "@nrvtickets/common";
import { Router, Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = Router();


router.get("/api/tickets/:id", async (req: Request, res: Response) => {

    const { id } = req.params;
    const ticket = await Ticket.findById(id); 

    if(!ticket) {
        throw new NotFoundError()
    }
    
    return res.status(200).send(ticket);
});


export { router as showTicketRouter };