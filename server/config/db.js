const mongoose = require ("mongoose");

const dbPath = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbPath);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;