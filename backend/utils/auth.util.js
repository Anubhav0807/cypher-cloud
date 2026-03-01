import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";

export const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "5h",
  });
  return token;
};

export const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  await userModel.findByIdAndUpdate(userId, {
    refreshToken: token,
  });
  return token;
};

export const generateOTP = () => {
  return Math.floor(Math.random() * 90000) + 100000;
};
