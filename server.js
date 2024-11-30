// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connect from "./src/db/connect.js";
// import cookieParser from "cookie-parser";
// import fs from "node:fs";
// import errorHandler from "./src/helpers/errorhandler.js";
// import path from "path";

// dotenv.config();

// const port = process.env.PORT || 8000;

// const app = express();

// // middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // error handler middleware
// app.use(errorHandler);

// //routes
// const routeFiles = fs.readdirSync("./src/routes");

// routeFiles.forEach((file) => {
//   // use dynamic import
//   import(`./src/routes/${file}`)
//     .then((route) => {
//       app.use("/api/v1", route.default);
//     })
//     .catch((err) => {
//       console.log("Failed to load route file", err);
//     });
// });

// const server = async () => {
//   try {
//     await connect();

//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   } catch (error) {
//     console.log("Failed to strt server...", error.message);
//     process.exit(1);
//   }
// };

// // Serve static files from the frontend directory
// const __dirname = path.resolve(); // Ensure __dirname is available
// app.use(express.static(path.join(__dirname, "frontend")));

// // Route all other requests to your frontend
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
// });

// server();



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
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Corrected the fallback operator
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Load routes
const routeFiles = fs.readdirSync("./src/routes");
routeFiles.forEach(async (file) => { // Added async here to use await
  try {
    const route = await import(`./src/routes/${file}`); // Corrected string interpolation
    app.use("/api/v1", route.default); // Ensure the route default export matches
  } catch (err) {
    console.error(`Failed to load route file ${file}:`, err.message); // Corrected string interpolation
  }
});



// Error handler middleware (placed at the end)
app.use(errorHandler);

// Server initialization
const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
            console.log(`Server is running on port ${port}`); // Corrected string interpolation
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


