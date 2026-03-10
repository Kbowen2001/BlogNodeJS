require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 4000;

const connectDB = require('./server/config/db');
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));