import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
import { config } from "dotenv";
config();
import bodyParser from "body-parser";

const app = express();

// Todo : middlewares
// app.use(express.json());
app.use(cors()); // Cross-Origin Resource Sharing (CORS) middleware for Express, using the whitelist method to allow all origins
// app.use(morgan("tiny")); // logs all http request into the console
app.disable("x-powered-by"); // less hackers know about our stack

// Custom format function for morgan logging
morgan.token("custom-time", () => {
  const date = new Date();
  const formattedDate = date.toISOString().replace("T", " ").slice(0, -1);
  return formattedDate;
});

// Define the custom logging format
const customLoggingFormat =
  ":custom-time - :method :url :status :response-time ms";

// Apply morgan middleware with the custom format
app.use(morgan(customLoggingFormat));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const PORT = process.env.PORT || 8080;

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
      app.listen(PORT, () => {
        console.log(`Server connected to http://localhost:${PORT}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });
