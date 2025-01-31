const mongoose = require('mongoose');

// Disable strict query mode
mongoose.set('strictQuery', false);

// MongoDB URI
const mongoURI = "mongodb+srv://allahkidunia7:K8FV8R645hLS6hpa@testing.ajzxk.mongodb.net/testing?retryWrites=true&w=majority&appName=testing";

// Updated connectToMongo function using async/await
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = connectToMongo;