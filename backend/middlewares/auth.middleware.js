import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const auth = async (request, response, next) => {
  try {
    const token = request.cookies.accessToken;

    if (!token) {
      return response.status(401).json({
        success: false,
        error: "Token not found",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
      const user = await userModel.findById(decode.id);

      if (!user) {
        return response.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      request.user = user;
      next();
    } catch (e) {
      return response.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export default auth;
