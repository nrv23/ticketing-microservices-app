import { CustomError } from './custom-error';


export class NotFoundError extends CustomError {

    statusCode = 404;

    constructor() {
        super("Ruta no encontrada");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {

        return [
            {
                message: "Ruta no encontrada"
            }
        ]
    }

    getStatusCode() {
        return this.statusCode;
    }
}