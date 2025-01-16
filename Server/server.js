require('dotenv').config(); // Load environment variables at the start

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const PORT = process.env.PORT || 8080;

console.log('MongoDB URI:', process.env.MONGO_URI); // Debug: Print MongoDB URI

require('./Models/db.js');

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/auth', AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
