import http from 'http';
import app from './app';
import connectDB from "./config/db";

const PORT: number = 3000;

const start = async () => {

  if(!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET debe estar definida");
  } 


  try {

    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Servidor escuchando peticiones en puerto ${PORT}`);
    });

  } catch (error) {
    console.log({ error })
    throw error;
  }
}

start();