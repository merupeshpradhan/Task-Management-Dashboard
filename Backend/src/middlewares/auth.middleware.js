import jwt from "jsonwebtoken";
import { User } from "../models/user.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) {
      throw new ApiError(401, "Please log in first to access this feature");
    }

    // Verify token
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user in DB
    req.user = await User.findById(decode.id).select("-password");
    if (!req.user) {
      throw new ApiError(401, "User not found. Please login again.");
    }

    // Continue
    next();
  } catch (error) {
    next(new ApiError(401, "Please log in first to access this feature"));
  }
};
