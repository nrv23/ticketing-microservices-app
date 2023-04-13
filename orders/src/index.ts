import mongoose from "mongoose";
import { natsWrapper } from './nats-wrapper';
import { app } from "./app";
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";


// Ejecutar el servidor

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }


  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }

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

    // escuchar los eventos

    // las ordenes y los ticquetes van a estar en el mismo servicio de ordenes para qie sea facil buscar la orden asociada al ticket
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
