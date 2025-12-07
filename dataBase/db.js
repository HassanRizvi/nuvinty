import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://nuvinty:nuvinty123456@cluster0.rfqzzdc.mongodb.net/nuvinty?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        // Connect to MongoDB - remove deprecated options
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Don't exit process, let it retry
        throw error;
    }
};

export default connectDB;
