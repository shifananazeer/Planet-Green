import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    role: string;
  };
}




export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET as string
) as {
  userId: string;
  role: string;
};

req.userId = decoded.userId;

req.user = {
  id: decoded.userId,
  role: decoded.role,
};

next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};


export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};