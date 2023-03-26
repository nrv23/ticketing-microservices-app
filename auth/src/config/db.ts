import mongoose from 'mongoose';

async function connectDB() {

    try {
    
        const connectId = await mongoose.connect("mongodb://auth-mongo-srv:27017/auth",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log("Conexion exitosa ",connectId.connection);

    } catch (error) {
        console.log({error});
    }
}



export default connectDB;