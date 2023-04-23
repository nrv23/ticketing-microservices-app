import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const OrderShow = ({ order,currentUser }) => {
    console.log({ order });
    const [seconds, setSeconds] = useState(0);

    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders') // redireccionar a las ordenes del cliente
    })

    useEffect(() => {

        const tiempoRestante = () => {
            const contadorSegundos = (new Date(order.expiresAt) - new Date()); // sacar la diferencia de tiempo para que la orden se cancele
            // sino se ha generado un pago
            setSeconds(Math.round(contadorSegundos  / 1000));
    

            console.log({ seconds })
        }
        tiempoRestante();
        const timerId = setInterval(tiempoRestante, 1000); // llamar cada segundo
        return () => {
            clearInterval(timerId)
        }
    }, [])

    if(seconds < 0) {
        return <div>Order expirada</div>;
    }

    return (

        <div>
            <p>{seconds} segundos antes de que el ticket expire</p>

            {
                errors.length > 0 && (
                    <div className="alert alert-danger">
                        <h4>Ooops....</h4>
                        <ul className="my-0">
                            {
                                errors.map(err => <li key={err.message}>{err.message}</li>)
                            }
                        </ul>
                    </div>
                )
            }
        
            <StripeCheckout
                token= {(token) => doRequest({token: token.id})}
                stripeKey="pk_test_51LhOdQE17ZUrsdagj9jt7QFRk8BYWhRh0ylgN9eyZPZzjUwyWaMHWkbG3Pm8MZxu9TGSlGqgzqeCS39NIJ3YQg7f006V9hoWZL"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    )
}


OrderShow.getInitialProps = async (context, client) => {

    const { orderId } = context.query;
    const { data: order } = await client.get(`api/orders/${orderId}`);

    return {
        order
    };
}
//

export default OrderShow;