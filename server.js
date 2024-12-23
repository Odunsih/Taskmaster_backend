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

// Development environment check
const isDevelopment = process.env.NODE_ENV !== 'production';

// CORS Configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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