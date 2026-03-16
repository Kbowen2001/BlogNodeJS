require('dotenv').config();

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const session = require("express-session");

const expressLayouts = require("express-ejs-layouts");
const express = require('express');
const app = express();
const PORT = 4000;

const connectDB = require('./server/config/db');
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.use(
session({
secret: "keyboard cat",
resave: false,
saveUninitialized: true,
store: MongoStore.create({
mongoUrl: process.env.MONGO_URI,
}),
})
);



const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
};

startServer();