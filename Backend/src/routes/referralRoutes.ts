import express from "express";
import { protect , isAdmin } from "../middlewares/authMiddleware";
import { getMyReferrals , getReferralTree , getFullNetworkTree , getNetworkStats } from "../controllers/referralController";



const router = express.Router();

router.get("/my-referrals" , protect , getMyReferrals )

router.get("/tree", protect, getReferralTree);

router.get("/admin/network-tree",protect,isAdmin,getFullNetworkTree);

router.get("/admin/network-stats",protect,isAdmin,getNetworkStats);
export default router;