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
import { Order } from '../models/order';
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

        await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100, // se debe enviar en centavos
            source: token
        })

        res.send({success: true});        
})


export { router as createChargeRouter }