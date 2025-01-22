import express from "express";
import { getMessages, sendMessage } from "../Controller/messageController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/get/:receiverId",authMiddleware,getMessages);
router.post("/send",authMiddleware,sendMessage);

export default router