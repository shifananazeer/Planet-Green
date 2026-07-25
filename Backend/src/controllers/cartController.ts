import { Request, Response } from "express";
import Cart from "../models/Cart";
import { AuthRequest } from "../middlewares/authMiddleware";
import Product from "../models/Product";


export const addToCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      productId,
      quantity,
    } = req.body;

    let cart =
      await Cart.findOne({
        user: req.userId,
      });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity +=
        quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message:
        "Product added to cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const getCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await Cart.findOne({
      user: req.userId,
    });

    console.log("Cart:", cart);

    const populatedCart =
      await Cart.findOne({
        user: req.userId,
      }).populate({
        path: "items.product",
      });

    console.log(
      "Populated Cart:",
      populatedCart
    );

    return res.json(populatedCart);

  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const removeFromCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item: any) =>
        item.product.toString() !==
        productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove item",
    });
  }
};



export const updateCartQuantity = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item: any) =>
        item.product.toString() ===
        productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Item not found in cart",
      });
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    if (action === "increment") {

      if (
        item.quantity >=
        product.stock
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Only ${product.stock} items available in stock`,
        });
      }

      item.quantity += 1;
    }

    else if (
      action === "decrement"
    ) {

      item.quantity -= 1;

      if (item.quantity <= 0) {

        cart.items =
          cart.items.filter(
            (cartItem: any) =>
              cartItem.product.toString() !==
              productId
          );
      }
    }

    else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid action",
      });
    }

    await cart.save();

    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate({
        path: "items.product",
        select:
          "name price images stock",
      });

    return res.status(200).json({
      success: true,
      message:
        "Cart updated successfully",
      cart: updatedCart,
    });

  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update cart",
    });
  }
};