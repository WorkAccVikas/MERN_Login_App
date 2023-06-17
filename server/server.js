import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
import { config } from "dotenv";
config();

const app = express();

// Todo : middlewares
app.use(express.json());
app.use(cors()); // Cross-Origin Resource Sharing (CORS) middleware for Express, using the whitelist method to allow all origins
app.use(morgan("tiny")); // logs all http request into the console
app.disable("x-powered-by"); // less hackers know about our stack

const port = 8080;

// Todo : Http Get Request
app.get("/", (req, res) => {
  res.status(200).json("Home Get Request");
});

// Todo : api routes
app.use("/api", router);

// Todo : Start server only when we have valid connection
connect()
  .then(() => {
    try {
      app.listen(process.env.PORT || port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });
