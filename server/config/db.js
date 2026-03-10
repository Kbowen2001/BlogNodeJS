const mongoose = require ("mongoose");


const dbPath = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbPath);
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;












const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);