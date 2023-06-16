import express from "express";
import cors from "cors";
import morgan from "morgan";

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

// Todo : Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
