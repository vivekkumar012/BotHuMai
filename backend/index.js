import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import chatbotRouter from "./routes/chatbot.router.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());

// Enhanced CORS configuration
const allowedOrigins = [
  "https://bot-hu-mai-gtmu.vercel.app",
  "https://bot-hu-mai-gtmu.vercel.app/" // Include both with and without trailing slash
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash from origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests explicitly
app.options('*', cors());

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DataBase is Connected");
} catch (error) {
    console.log("Error in DataBase Connection");
}

app.use("/v1/bot", chatbotRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`App is listening on Port ${port}`)
})