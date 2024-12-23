import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "path";
import errorHandler from "./src/helpers/errorhandler.js";

dotenv.config();

const port = process.env.PORT || 8000; // Corrected the fallback operator
const __dirname = path.resolve(); // Ensure proper path handling

const app = express();

// Middleware
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://taskmaster-backend-six.vercel.app',
  process.env.CLIENT_URL,
  "https://674b80d4ec488698b05cea95--tassks-master.netlify.app"
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Load routes
const routeFiles = fs.readdirSync("./src/routes");
routeFiles.forEach(async (file) => {
  try {
    const route = await import(`./src/routes/${file}`); // Dynamically import routes
    app.use("/api/v1", route.default); // Use default exports from routes
  } catch (err) {
    console.error(`Failed to load route file ${file}:`, err.message);
  }
});

// Error handler middleware (placed at the end)
app.use(errorHandler);

// Server initialization
const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "frontend")));
// Route all other requests to your frontend's index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
// });