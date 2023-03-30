import express from "express";
import 'express-async-errors'; // manejo de errores asincronos en express

import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from './routes/middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';



const app = express();
app.set("trust proxy", true);



// se va guardar el jwt como una cookie
app.use(
  cookieSession({ //
    signed: false, // no encriptar el token que se va enviar la cabecera el cookie
    secure: process.env.NODE_ENV !== "test" // el cookie se va enviar unicamente en conexiones https. Esto debe estar como default en true
  })
)
app.use(express.json());


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => { // si la ruta no existe devolver este mensaje de error, no importa el verbo http
  throw new NotFoundError();
})

// dejar el manejador de errores al final para poder capturar y manejar los errores de express
app.use(errorHandler); // express pasa los parametros por referencia y llama la funcion en request que viene al servidor
//la funcion errorHandler escucha si en algun momento en algun route ocurre un error. SI un error ocurre entonces 
// este middleware lo atrapa y devuelve la respuesta al cliente.


export default app;