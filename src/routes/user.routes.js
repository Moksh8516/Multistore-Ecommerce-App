import { Router } from "express"
import { changePassword, forgetPassword, getCurrentUser, getUpdateAccountDetails, getUpdateAvatarImg, login, logout, refreshAndAccessToken, register, resetPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// POST REQUEST
router.route("/register").post(upload.fields([
  { name: "avatar", maxCount: 1 }
]), register)
router.route("/login").post(login)

// Secured Routes
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-token").post(refreshAndAccessToken)
router.route("/forgot-password").post(forgetPassword)

// PATCH REQUEST
router.route("/update-profile").patch(verifyJWT, getUpdateAccountDetails)
router.route("/update-password").patch(verifyJWT, changePassword)
router.route("/update-profile-image").patch(verifyJWT, upload.single("avatar"), getUpdateAvatarImg)
router.route("/reset-Password/:token").patch(resetPassword)

// GET REQUEST
router.route("/profile").get(verifyJWT, getCurrentUser)

export { router };