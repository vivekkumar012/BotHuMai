import express from "express"
import { Message } from "../controllers/chatbot.message.js";

const chatbotRouter = express.Router();

chatbotRouter.post("/message", Message);

export default chatbotRouter;