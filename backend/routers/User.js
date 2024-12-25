import express from "express";
import {
  register,
  verify,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  historicalBill,
  accountStatus,
  changeName,
  changeReferenceNumber,
  changeMeterID,
  smartMeter,
  verifyResetPasswordOTP,
  darkMode,
} from "../controllers/User.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();
router.route("/register").post(register);
router.route("/verify").post(isAuth, verify);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/changepassword").put(isAuth, changePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyResetPasswordOTP").post(verifyResetPasswordOTP);
router.route("/resetpassword").put(resetPassword);
router.route("/historicalBill").post(historicalBill);
router.route("/accountStatus").post(accountStatus);
router.route("/changeName").put(isAuth, changeName);
router.route("/changeReferenceNumber").put(isAuth, changeReferenceNumber);
router.route("/changeMeterID").put(isAuth, changeMeterID);
router.route("/smartMeter").post(smartMeter);
router.route("/darkMode").put(isAuth, darkMode);

export default router;
