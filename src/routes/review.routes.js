import { Router } from "express"
import { createReview } from "../controllers/review.controller.js";
const router = Router();

router.route("/give-review").post(createReview)
export { router };