
import { Request, Response, NextFunction } from 'express';
import { Token } from '../../utils/token';
import { IUserPayload } from '../../interfaces/IUserPayload';

// agregar una variable global a una interfaz dentro de un namespace

declare global {
    namespace Express {
        interface Request { // se puede agregar variables o funciones a interfaces globales de express
            currentUser?: IUserPayload;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {

    try {

        if (!req.session?.jwt) {
           return next();
        }

        const currentUser = Token.verifiyToken(req.session?.jwt!) as IUserPayload;
        req.currentUser = currentUser;
        return next();

    } catch (error) {
        console.log({ error });
    }

    next();
}