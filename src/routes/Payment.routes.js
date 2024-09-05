import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentHandler } from "../services/Payment.services.js";
const router = Router();
router.route("/create-payment-intent").post(paymentHandler)
export { router };