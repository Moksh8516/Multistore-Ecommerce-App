import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, fetchOrder } from "../controllers/order.controller.js";
const router = Router();

router.route("/").post(verifyJWT, createOrder)
router.route("/").get(verifyJWT, fetchOrder)

export { router }