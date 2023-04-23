import useRequest from "../../hooks/useRequest";
import Router from 'next/router';

const TicketShow = ({ ticket }) => {

    //api/orders

    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id
        },
        onSuccess: order => Router.push('/orders/[orderId]',`/orders/${order.id}`)
    })
    return (
        <div>

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
            <h1>{ticket.title}</h1>
            <h4>Price: ${ticket.price}</h4>
            <button className="btn btn-primary" onClick={() => doRequest()} >
                Compra
            </button>
        </div>
    )
}

TicketShow.getInitialProps = async (context, client) => {

    const { ticketId } = context.query;
    const { data: ticket } = await client.get(`api/tickets/${ticketId}`);

    return {
        ticket
    };
}
export default TicketShow;