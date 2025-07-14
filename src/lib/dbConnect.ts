import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number;

}

const connection :ConnectionObject={}

async function dbConnect():Promise<void>{ //this func returns a promise that resolves to void(no meaningful value)
    if(connection.isConnected){
        console.log("Already connected to database. Using existing connection from here.");
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected=db.connections[0].readyState
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process with failure gracefully
        
    }

}

export default dbConnect;

