import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getMe , updateProfile  , changePassword} from "../controllers/profileController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.get("/me", protect, getMe);

router.put("/update",protect,upload.single("profileImage"),updateProfile);

router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;