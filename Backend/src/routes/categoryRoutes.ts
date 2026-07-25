import express from "express";

import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
} from "../controllers/categoryController";
import { upload } from "../middlewares/upload";

import {
  protect,
  isAdmin,
} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/",protect ,isAdmin,upload.single("image"),createCategory);

router.get("/",getCategories);

router.delete("/:id",protect, isAdmin, deleteCategory);

router.put( "/:id",protect , isAdmin,upload.single("image"), updateCategory);

export default router;