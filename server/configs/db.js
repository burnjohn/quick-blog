import mongoose from "mongoose";


const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log("✅ Database Connected Successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("⚠️  MongoDB disconnected");
        });

        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:");
        console.error("Error:", error.message);
        console.error("\nPlease check:");
        console.error("1. Your .env file exists in the server directory");
        console.error("2. MONGODB_URI is correctly formatted");
        console.error("3. MongoDB Atlas cluster is accessible");
        console.error("4. Network/firewall allows MongoDB connections");
        console.error("\nExample MONGODB_URI format:");
        console.error("mongodb+srv://username:password@cluster.mongodb.net");
        process.exit(1); // Exit if DB connection fails
    }
}

export default connectDB;