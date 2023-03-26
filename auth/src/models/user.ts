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

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export default User;