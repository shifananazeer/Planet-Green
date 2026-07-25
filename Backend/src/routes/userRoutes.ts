import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getDashboard , checkout , getMyOrders, verifyPayment} from "../controllers/userController";


const router = express.Router();

router.get("/dashboard",protect,getDashboard);

router.post("/checkout", protect, checkout);

router.get("/my-orders",protect,getMyOrders);

router.post("/verify-payment", protect, verifyPayment);


export default router;