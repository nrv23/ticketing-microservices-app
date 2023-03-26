import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {

    statusCode = 500;
    private reason = "Hubo un error en la conexión con la base de datos"

    constructor() {
        super("Hubo un erorr al conectar con la bd");

        // Solamente porque se extiende una clase construida
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);

    }

    serializeErrors() {

        return [{ message: this.reason }]
    }

    getStatusCode() {
        return  this.statusCode
    }
}