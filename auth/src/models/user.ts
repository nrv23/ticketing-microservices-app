import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';
import { IUserModel } from '../interfaces/IUserModel';
import { IUserDoc } from '../interfaces/IUserDoc';
import { Password } from '../utils/password';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret) { // primer parametro es el Modelo y segundo, los valores de respuesta del modelo 
            // por lo que se pueden eliminar las propiedades que no se quieren devolver.
            // y al mismo tiempo convertirlo a JSON.
            
            ret.id = ret._id;

            delete ret.password; // eliminar el password de la respuesta al crear un nuevo usuario
            delete ret.__v;
            delete ret._id;
        }
    }
});

userSchema.pre('save', async function (done: mongoose.HookNextFunction) { // este hook se ejecuta antes de guardar el usuario

    if (this.isModified("password")) { // cuando se crea un nuevo usuario, mongodb retorna true 
       
        const newPass = await Password.toHash(this.get("password"));
        this.set("password", newPass);
    }

    done(); // se llama para que proceda a guardar el usuario
})

// agregar una funcion personalizada al modelo User 
userSchema.statics.build = (user: IUser) => {
    return new User(user);
};

// tipar el tipo de documento, y el modelo de mongoose.
/*
    la funcion mongoose.model utiliza tipos de datos que son genericos, en este caso se tipa el tipo de documento y el tipo 
    de coleccion para que typescript sea lo que devuelve la coleccion 

    mongoose.model<IUserDoc, IUserModel>
*/
const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export default User;