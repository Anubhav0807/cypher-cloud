import bcryptjs from "bcryptjs";
import crypto from "crypto";

import userModel from "../models/user.model.js";

import { sendEmail } from "../utils/email.util.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
} from "../utils/auth.util.js";

import verifyEmailTemplate from "../templates/verifyEmail.template.js";
import resetPwdTemplate from "../templates/resetPwd.template.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const totalStorage = 20 * 1024 * 1024; // 20MB

export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        error: "Please fill in the required details",
      });
    }

    const user = await userModel.findOne({ "email.value": email });

    if (!user) {
      return response.status(400).json({
        success: false,
        error: "Please sign in to continue",
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        success: false,
        error: "Please enter the correct password or email",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    return response.status(200).json({
      success: true,
      message: "User is logged in successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const registerController = async (request, response) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        success: false,
        error: "Please fill the required details",
      });
    }

    const user = await userModel.findOne({ "email.value": email });

    if (user) {
      return response.status(400).json({
        success: false,
        error: "Email is already registered",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const emailVerificationCode = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpiry = Date.now() + 1000 * 60 * 60 * 24; // 1 day
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?code=${emailVerificationCode}`;

    const payload = {
      name: name,
      email: {
        value: email,
        verified: false,
        verificationCode: emailVerificationCode,
        verificationExpiry: emailVerificationExpiry,
      },
      password: hashPassword,
      storage: { total: totalStorage },
    };

    const newUser = new userModel(payload);
    await newUser.save();

    sendEmail({
      to: email,
      subject: "Verify Email",
      html: verifyEmailTemplate({ name: name, link: verifyLink }),
    });

    return response.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const verifyEmailController = async (request, response) => {
  try {
    const { verificationCode } = request.body;
    const user = await userModel.findOne({
      "email.verificationCode": verificationCode,
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        error: "Invalid token, failed to verify",
      });
    }

    if (user.email.verificationExpiry < Date.now()) {
      return response.status(400).json({
        success: false,
        error: "Expired token, failed to verify",
      });
    }

    user.email.verified = true;
    user.email.verificationCode = undefined;
    user.email.verificationExpiry = undefined;

    await user.save();

    return response.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const logoutController = async (request, response) => {
  try {
    response.clearCookie("accessToken", cookieOptions);
    response.clearCookie("refreshToken", cookieOptions);

    request.user.refreshToken = null;
    await request.user.save();

    return response.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const updateUserController = async (request, response) => {
  try {
    const { name, email, password, mobile} = request.body;

    if (email && email !== request.user.email.value) {
      const user = await userModel.findOne({
        "email.value": email,
        _id: { $ne: request.user._id },
      });
      if (user) {
        return response.status(409).json({
          success: false,
          error: "This email is already in use",
        });
      }

      const emailVerificationCode = crypto.randomBytes(32).toString("hex");
      const emailVerificationExpiry = Date.now() + 1000 * 60 * 60 * 24; // 1 day
      const verifyLink = `${process.env.FRONTEND_URL}/verify-email?code=${emailVerificationCode}`;

      request.user.email = {
        value: email,
        verified: false,
        verificationCode: emailVerificationCode,
        verificationExpiry: emailVerificationExpiry,
      };

      sendEmail({
        to: email,
        subject: "Verify Email",
        html: verifyEmailTemplate({
          name: request.user.name,
          link: verifyLink,
        }),
      });
    }

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);
      request.user.password = hashPassword;
    }

    if (name) request.user.name = name;
    if (mobile) request.user.mobile = mobile;

    await request.user.save();

    return response.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const forgotPasswordController = async (request, response) => {
  try {
    const { email } = request.body;

    const user = await userModel.findOne({ "email.value": email });

    if (!user) {
      return response.status(400).json({
        success: false,
        error: "The User is not registered with us",
      });
    }

    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.otp = {
      value: otp,
      verificationExpiry: expiryTime,
      verified: false,
    };
    await user.save();

    sendEmail({
      to: email,
      subject: "Reset Password OTP",
      html: resetPwdTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return response.status(200).json({
      success: true,
      message: "Please check your email",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const verifyForgotPWDController = async (request, response) => {
  try {
    const { email, otp } = request.body;

    const user = await userModel.findOne({ "email.value": email });

    if (!user || !user.otp?.value || !otp) {
      return response.status(400).json({
        success: false,
        error: "User doesn't exist or OTP is not present",
      });
    }
    if (otp !== user.otp.value) {
      return response.status(400).json({
        success: false,
        error: "OTP entered is wrong",
      });
    }

    if (user.otp.verificationExpiry < Date.now()) {
      return response.status(400).json({
        success: false,
        error: "OTP has expired please create new OTP",
      });
    }

    user.otp.verified = true;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Can change your password",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const resetPWDController = async (request, response) => {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        success: false,
        error: "Please provide all the necessary details",
      });
    }
    const user = await userModel.findOne({ "email.value": email });
    if (!user) {
      return response.status(400).json({
        success: false,
        error: "Email invalid",
      });
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        success: false,
        error: "Confirm password and password is wrong",
      });
    }

    if (!user.otp?.verified) {
      return response.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashPassword;
    user.otp = undefined;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Password is successfully changed",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
