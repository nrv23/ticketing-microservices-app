import { Router, Request, Response } from "express";
import { body } from "express-validator";

import User from "../models/user";
import { BadRequestError } from '../errors/badrequest-error';
import { Token } from '../utils/token';
import { validateRequest } from './middleware/validate-request';

const router = Router();

router.post("/api/users/signup", [
    body("email").isEmail().withMessage("El email debe ser válido"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("El password debe contener entre 4 y 20 caracteres")
], validateRequest,async (req: Request, res: Response) => {

   /* const errors = validationResult(req);

    if (!errors.isEmpty()) {
       // return res.status(400).send(errors.array());
    
        throw new RequestValidationError(errors.array()) // La informacion que se envia en el constructor de la
        // clase error, es la propiedad message cuando el error es manejado en algun catch o middleware que recibe el
        // error como parametro de funcion
    } */

    const { email, password } = req.body;

    const exists = await User.findOne({email});

    if(exists) {
        console.log("Email en uso");
        throw new BadRequestError("El usuario ya existe");
    }

    const user = await (User.build({
        email,
        password
    })).save();

    req.session = {
        jwt: Token.signToken(user.id, user.email )
    };
    
    res.status(201).send(user);
})

export { router as signupRouter }