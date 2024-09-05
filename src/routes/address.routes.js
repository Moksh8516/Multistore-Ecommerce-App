import { Router } from "express";
import { createAddress, deleteAddress, readAddress, updateAddress } from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//Get
router.route("/").get(verifyJWT, readAddress)

//Post
router.route("/").post(verifyJWT, createAddress)

// Patch
router.route("/:id").patch(verifyJWT, updateAddress)

//Delete
router.route("/:id").delete(verifyJWT, deleteAddress)

export { router }