import { Router } from "express";
import { createBrand, fetchAllBrands } from "../controllers/brand.controller.js";
const router = Router()

router.route("/").get(fetchAllBrands)
router.route("/").post(createBrand)

export { router };