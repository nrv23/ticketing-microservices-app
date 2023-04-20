import { 
    BadRequestError, 
    requireAuth, 
    validateRequest, 
    NotFoundError,
    NotAuthorizedError, 
    OrderStatus 
} from '@nrvtickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = Router();


router.post('/api/payments',
    requireAuth,
    [
        body("token").not().isEmpty(),
        body("orderId").not().isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("No se puede procesar el pago de una orden cancelada");
        }

        const charge =  await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100, // se debe enviar en centavos
            source: token
        });

        const payment =  Payment.build({
            orderId,
            stripeId: charge.id
        })

        await payment.save();
        
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        res.status(201).send({ id: payment.id});       
})


export { router as createChargeRouter }