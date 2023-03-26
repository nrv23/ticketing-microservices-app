import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {


    static async toHash(pass: string) {

        const salt = randomBytes(8).toString("hex"); 
        const buff = (await scryptAsync(pass,salt,64)) as Buffer;

        return `${buff.toString("hex")}.${salt}`;
    }

    static async compare(storedPass: string, suppliedPass: string) {

        const [hashedPass,salt] = storedPass.split('.');
        const buff = (await scryptAsync(suppliedPass,salt,64)) as Buffer;

        return buff.toString("hex") === hashedPass; // compara las contraseñas
    }
}