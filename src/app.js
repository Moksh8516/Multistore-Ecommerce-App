import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();

// middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "20kb",
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  Credential: true,
}))
app.use(express.static("public"))
app.use(cookieParser())
app.get("/", (req, res) => {
  res.send("Hello World")
})
// import routes
import { router as userRouter } from "./routes/user.routes.js"
import { router as productRouter } from "./routes/product.routes.js"
import { router as brandRoutes } from "./routes/brand.routes.js"
import { router as categoryRoutes } from "./routes/category.routes.js"
import { router as addressRoutes } from "./routes/address.routes.js"
import { router as reviewRouter } from "./routes/review.routes.js";
import { router as cartRouter } from "./routes/cart.routes.js"
import { router as orderRouter } from "./routes/order.routes.js"
import { router as PaymentRouter } from "./routes/Payment.routes.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

// use Routes
app.use("/api/v1/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/brands", brandRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/address", addressRoutes)
app.use("/api/review", reviewRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/payment", PaymentRouter)
app.use(errorHandler())

export { app };