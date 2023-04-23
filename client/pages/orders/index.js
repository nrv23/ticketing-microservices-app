import useRequest from './../../hooks/useRequest';

const Orders = ({ orders }) => {

    console.log({orders});

    return (
        <ul>
            {
                orders.map(order => {
                    return <li key={order.id}>
                        {order.ticket.title} - {order.status}
                    </li>
                })
            }
        </ul>
    )
}

Orders.getInitialProps= async (context, client) => {

    const { data: orders } = await client.get("/api/orders");

    return { orders }
}
export default Orders;