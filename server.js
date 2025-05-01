import express from "express";
import { createServer } from "http"; // Create an HTTP server
import { Server } from "socket.io"; // Import the correct Socket.io server class
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import initiateSocket from "./src/socket/index.js";
import authRouter from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server instance

const RODCHATURL = process.env.RODCHATURL;

// CORS configuration
const corsOptions = {
  origin: [RODCHATURL],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

// Route Handlers
app.get("/api", (req, res) => {
  res.send("Hello, welcome to my portfolio backend!");
});

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions, // Use same CORS settings
});

// initiating socket
initiateSocket(io);

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server is running on port ${port}`);
  }
  console.log("Server Started");
});
