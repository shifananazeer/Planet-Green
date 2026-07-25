import express from "express";
import {
  getWalletSummary,
  getCommissionHistory,
  getWalletDashboard,
} from "../controllers/walletController";

import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/summary",
  protect,
  getWalletSummary
);

router.get(
  "/commissions",
  protect,
  getCommissionHistory
);

router.get(
  "/dashboard",
  protect,
  getWalletDashboard
);

export default router;