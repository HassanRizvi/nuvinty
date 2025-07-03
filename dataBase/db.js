import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://nuvinty:nuvinty123456@cluster0.rfqzzdc.mongodb.net/nuvinty?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
