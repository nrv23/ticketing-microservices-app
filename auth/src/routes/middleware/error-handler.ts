import { NextFunction, Request, Response } from "express";
import { CustomError } from '../../errors/custom-error';

export const errorHandler = (err: Error,req: Request,res: Response,next: NextFunction) => {

    if( err instanceof CustomError) { // este if pregunta si el error es personalizado y devuelve la respuesta con los datos del error

        return res.status(err.getStatusCode()).send({errors: err.serializeErrors()});
    }

    return res.status(400).send({ errors: [{ message: err.message }] });
}