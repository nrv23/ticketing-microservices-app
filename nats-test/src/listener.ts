import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString("hex"), { // siempre en las conexiones el clientid debe ser unico
    url: "http://localhost:4222"
});

stan.on("connect", () => {
    console.log("Listener conectado a NATS");
    
    stan.on("close", () => {
        console.log("NATS connection closed!");

        process.exit(); // matar la conexion para que el servidor de nats no intente reconectar nuevamente
    })

    new TicketCreatedListener(stan).listen();
})

process.on("SIGINT", () => stan.close())
process.on("SIGTERM", () => stan.close())

