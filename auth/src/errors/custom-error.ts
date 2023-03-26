import { ICustomError } from '../interfaces/ICustomError';


export abstract class CustomError extends Error {

    abstract statusCode: number;

    constructor(message: string) { // enviar un mensaje en string para guardar los logs de los posibles errores
        super(message);

         // Solamente porque se extiende una clase construida
         Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): ICustomError[];
    abstract getStatusCode(): number;
}