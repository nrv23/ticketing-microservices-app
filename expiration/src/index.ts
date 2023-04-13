
import { OrderCreatedListener } from './events/listener/order-created-listener';
import { natsWrapper } from './nats-wrapper';


const start = async () => {


  // variables de nats 

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined!");
  }


  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined!");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined!");
  }

  try {

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsWrapper.client.on("close", () => {
      console.log("Conexion con NATS terminada");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client!.close());
    process.on("SIGTERM", () => natsWrapper.client!.close());

    new OrderCreatedListener(natsWrapper.client).listen();

    console.log("Servicio de expiración de tickets cargado")
  } catch (err) {
    console.error(err);
  }
};

start();
