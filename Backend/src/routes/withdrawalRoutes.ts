import express from "express";
import { protect , isAdmin } from "../middlewares/authMiddleware";
import { createWithdrawalRequest , getMyWithdrawals , getAllWithdrawals , approveWithdrawal , rejectWithdrawal , markWithdrawalPaid } from "../controllers/withdrawalController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post(
  "/request",
  protect,
  createWithdrawalRequest
);

router.get(
  "/my",
  protect,
  getMyWithdrawals
);

router.get(
  "/admin/all",
  protect,
  isAdmin,
  getAllWithdrawals
);

router.put(
  "/admin/:id/approve",
  protect,
  isAdmin,
  approveWithdrawal
);

router.put(
  "/admin/:id/reject",
  protect,
  isAdmin,
  rejectWithdrawal
);

// router.put(
//   "/admin/:id/paid",
//   protect,
//   isAdmin,
//   markWithdrawalPaid
// );

router.put(
  "/admin/:id/paid",
  protect,
  isAdmin,
  upload.single("proof"),
  markWithdrawalPaid
);

export default router;