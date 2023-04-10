import { validateRequest, requireAuth, NotFoundError, OrderStatus,BadRequestError } from '@nrvtickets/common';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/api/orders", requireAuth,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input) ) // validar que el id que se pasa es valido para mongodb
            .withMessage("TicketId es requerido")
    ], validateRequest,
    async (req: Request, res: Response) => {

        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);

        if(!ticket) {
            throw new NotFoundError();
        }

        const isReserved = await ticket.isReserved();

        if(isReserved) {
            throw new BadRequestError("El ticket ya está reservado")
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();

        // publicar el evento de orden creada

        new OrderCreatedPublisher(natsWrapper.client).publish({
           id: order.id,
           status: order.status,
           userId: order.userId,
           expiresAt: order.expiresAt.toISOString(),
           ticket: {
               id: ticket.id,
               price: ticket.price
           }
        })

    res.status(201).send(order);
})


export { router as  newOrderRouter };