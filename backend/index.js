import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import chatbotRouter from "./routes/chatbot.router.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());

// Fixed CORS configuration
app.use(cors({
  origin: "https://bot-hu-mai-gtmu.vercel.app/", // Your frontend URL
  credentials: true, // Allow credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


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