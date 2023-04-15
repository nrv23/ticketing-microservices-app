import Stripe from 'stripe';

export const stripe = new Stripe(process.env.API_SECRET!,{
    apiVersion: "2022-11-15"
})