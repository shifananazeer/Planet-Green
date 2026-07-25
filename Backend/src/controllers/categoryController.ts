import { Request, Response } from "express";
import streamifier from "streamifier";
import Category from "../models/Category";
import cloudinary from "../config/cloudinary";

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory =
      await Category.findOne({
        name: {
          $regex: new RegExp(
            `^${name.trim()}$`,
            "i"
          ),
        },
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let image = "";

    const file = req.file;

    if (file) {
      const result: any = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "green-planet/categories",
              },
              (error, result) => {
                if (error)
                  reject(error);
                else
                  resolve(result);
              }
            );

          streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);
        }
      );

      image = result.secure_url;
    }

    const category =
      await Category.create({
        name: name.trim(),
        description:
          description?.trim() || "",
        image,
      });

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
    });

  } catch (error) {
    console.error(
      "Create Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create category",
    });
  }
};


export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories =
      await Category.find()
        .sort({ name: 1 })
        .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });

  } catch (error) {
    console.error(
      "Get Categories Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch categories",
    });
  }
};


  export const deleteCategory =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const category =
        await Category.findByIdAndDelete(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete category",
      });
    }
  };


  export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate name
    if (name) {
      const existingCategory =
        await Category.findOne({
          _id: { $ne: id },
          name: {
            $regex: new RegExp(
              `^${name.trim()}$`,
              "i"
            ),
          },
        });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message:
            "Category name already exists",
        });
      }
    }

    let image = category.image;

    const file = req.file;

    if (file) {
      const result: any = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "green-planet/categories",
              },
              (error, result) => {
                if (error)
                  reject(error);
                else
                  resolve(result);
              }
            );

          streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);
        }
      );

      image = result.secure_url;
    }

    const updatedCategory =
      await Category.findByIdAndUpdate(
        id,
        {
          name:
            name?.trim() ||
            category.name,
          description:
            description ??
            category.description,
          image,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
      category: updatedCategory,
    });

  } catch (error) {
    console.error(
      "Update Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update category",
    });
  }
};