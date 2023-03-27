import { sign, verify } from "jsonwebtoken";


export class Token {
    constructor() {

    }

    static verifiyToken(token: string) {

       return verify(token, process.env.JWT_SECRET!)
    }

    static signToken(user: string,email: string ) {
        return sign({
            id: user,
            email
        },process.env.JWT_SECRET!); // poner signo de exclamacion le indica a Typescript que la variable esta obligatoriamente definifa
    }
}