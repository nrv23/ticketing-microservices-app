import { currentUser, requireAuth } from '@nrvtickets/common';
import { Router, Request,Response } from 'express';

const router = Router();

router.post("/api/tickets",requireAuth, async(req: Request, res: Response) => {

    res.sendStatus(200);
})

export { router as createTicketRouter };