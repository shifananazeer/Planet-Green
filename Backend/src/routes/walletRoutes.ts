import express from "express";
import {
  getWalletSummary,
  getCommissionHistory,
  getWalletDashboard,
  getMyTransactions,
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


router.get(
  "/transactions",
  protect,
  getMyTransactions
);



export default router;