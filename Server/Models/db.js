const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI;

if (!dbURI) {
    console.error('MongoDB URI is not defined in environment variables.');
    process.exit(1); // Exit if no URI is found
}

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to mongoDb");
}).catch((err) => {
    console.log("Error in connection : ", err);
});