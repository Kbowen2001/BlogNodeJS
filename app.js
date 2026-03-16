require("dotenv").config();

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo").default;
const methodOverride = require("method-override");
const session = require("express-session");

const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";

const connectDB = require("./server/config/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
};

startServer();