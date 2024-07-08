import mongoose from "mongoose"

// the datatype of the obect which is coming after the connection to the database
type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}


// void means it doesn't care what type of data will be coming
async function dbConnect(): Promise<void> {

    // needs to check the connection otherwise it will cause database choking. 
    if (connection.isConnected) {
        console.log("Already connected to the database.");
        return
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || "")   // could send options field here also, {}
        console.log(db);
        console.log(db.connections);
        
        connection.isConnected = db.connections[0].readyState
        console.log("Db Connected Successfully!");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit()
    }

}

export default dbConnect