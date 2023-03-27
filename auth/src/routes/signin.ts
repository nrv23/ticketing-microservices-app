import { Router, Response, Request } from "express";
import { body } from 'express-validator';
import User from "../models/user";
import { validateRequest } from './middleware/validate-request';
import { BadRequestError } from '../errors/badrequest-error';
import { Password } from '../utils/password';
import { Token } from '../utils/token';

const router = Router();

router.post("/api/users/signin",
    [
        body("email").isEmail().withMessage("El email debe ser válido"),
        body("password").trim().isLength({ min: 4, max: 20 }).withMessage("El password debe contener entre 4 y 20 caracteres")
    ]
    , validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user) {
       throw new BadRequestError("Credenciales incorrectas"); 
    }

    if(!(await Password.compare(user.password,password))) {
        throw new BadRequestError("Credenciales incorrectas"); 
    }

    req.session = { // setear el token en la cookie, de esa forma el navegador va manejar automaticamente el envio del token en cada peticion
        jwt: Token.signToken(user.id, user.email )
    };
    
    res.status(200).send(user);


})

export { router as signinRouter }