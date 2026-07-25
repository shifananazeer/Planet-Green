import { Router } from "express";
import {  login, logout, signup } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post( "/forgot-password", forgotPassword);

router.post( "/reset-password/:token", resetPassword);

router.post("/logout", logout);




export default router;