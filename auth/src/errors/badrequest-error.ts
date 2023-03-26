import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {

    statusCode: number = 400;


    constructor(pmessage: string) {

        super(pmessage);

        // Solamente porque se extiende una clase construida
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {

        return [{ message: this.message }]
    }

    getStatusCode() {

        return this.statusCode;
    }
}