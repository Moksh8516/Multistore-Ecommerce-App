import { Router } from "express"
import { createProduct, fecthProductWithSorting, fetchProductById, updateProduct } from "../controllers/product.controller.js";
const router = Router();

// GET
router.route("/").get(fecthProductWithSorting)
router.route("/:_id").get(fetchProductById)

// post 
router.route("/createProduct").post(createProduct)

// PACTH
router.route("/update-product/:_id").patch(updateProduct)

export { router }