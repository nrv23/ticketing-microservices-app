import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
TicketCreatedPublisher

//crear instancia de cliente de nats-streaming
const stan = nats.connect('ticketing', 'abc', {
    url: "http://localhost:4222"
});

stan.on("connect", async () => {

    try {

        console.log("Publisher connected to NATS");

        // informacion que se va compartir 
        const data = {
            id: "123",
            title: "concert",
            price: 1234
        };

        const publisher = new TicketCreatedPublisher(stan);
        await publisher.publish(data);
    
    } catch (error) {
        console.log(error);
    }
})

// 