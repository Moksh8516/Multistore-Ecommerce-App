import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addToCartItem, getCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js";
const router = Router();

router.route("/").get(verifyJWT, getCart)
router.route("/items").post(verifyJWT, addToCartItem)
router.route("/items/:cartItemId").patch(verifyJWT, updateCartItem)
router.route("/items/:cartItemId").delete(verifyJWT, removeCartItem)
router.route("/").delete(verifyJWT, clearCart)

export { router };