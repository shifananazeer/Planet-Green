import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  
} from "../controllers/productController";

import {
  protect,
  isAdmin,
} from "../middlewares/authMiddleware";

import { upload } from "../middlewares/upload";
import { addToCart, getCart , removeFromCart , updateCartQuantity } from "../controllers/cartController";

const router = express.Router();

router.post(  "/",  protect,  isAdmin,  upload.array("images", 5),  createProduct);

router.get("/", getProducts);

router.get("/cart", protect , getCart )

router.get( "/:id", getProductById);

router.delete("/:id", deleteProduct);

router.put("/:id", upload.array("images"),updateProduct);

router.post("/cart/add" ,protect , addToCart)

router.delete("/cart/remove/:id" , protect , removeFromCart )

router.put( "/cart/:productId", protect, updateCartQuantity);

export default router;