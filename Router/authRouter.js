import express from "express";
import { forgotPassword, getUser, login, register, resetPassword } from "../Controller/authController.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/users", getUser);
 
export default router