import { Request, Response } from "express";
import Product from "../models/Product";
import { uploadToCloudinary } from "../utils/uploadHelper";

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
    } = req.body;
    console.log("Files:", req.files);
    const files = req.files as Express.Multer.File[];
    console.log(files);
    const imageUrls = await Promise.all(
  files.map((file) =>
    uploadToCloudinary(file.buffer)
  )
);


    const product =
  await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images: imageUrls,
  });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to create product",
    });
  }
};



export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products =
      await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch products",
    });
  }
};


export const getProductById =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        ).populate("category");

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch product",
      });
    }
  };



  export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};


export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const updated =
      await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

    res.json({
      success: true,
      product: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};