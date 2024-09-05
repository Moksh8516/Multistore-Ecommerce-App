import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
  const { Productname, brand, description, category } = req.body
  if ([Productname, brand, description, category].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }
  const product = new Product(req.body)
  const response = await product.save()
  return res
    .status(201)
    .json(new ApiResponse(200, response, "New Product has been created"))
})

const fecthProductWithSorting = asyncHandler(async (req, res) => {
  // fetch all Product
  let product = Product.find({})

  if (!product) {
    throw new ApiError(500, "product is not found")
  }
  // Product Sorting Accourding some filterization
  // try {
  // Sorting on the bases of category
  if (req.query.category) {
    product = product.find({ category: req.query.category })
  }

  // Sorting on the bases of brand
  if (req.query.brand) {
    product = product.find({ brand: req.query.brand })
  }

  // Sorting on the bases of order and filter

  if (req.query._sort && req.query._order) {
    // product.sort("title":"desc")
    product = product.sort({ [req.query._sort]: req.query._order })
  }

  // Sorting on the bases of pagination

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    product = product.skip(pageSize * (page - 1)).limit(pageSize)
  }
  // const docs = await product.count();
  // console.log(docs)
  const filterDocs = await product.exec();
  // store in headers
  // res.set("X-Total-Count", totalDocs);
  return res
    .status(201)
    .json(new ApiResponse(200, filterDocs, "Successfully fetched product"))
  // } catch (error) {
  //   throw new ApiError(409, "unauthorized Request on fecth Product component")
  // }
})

const fetchProductById = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ApiError(401, "unauthorized request")
  }

  const productId = await Product.findById(_id)
  if (!productId) {
    throw new ApiError(404, "product is not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, productId, "successfully fetch Product"))
})

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "unauthorized request")
  }
  const product = await Product.findByIdAndUpdate(id,
    {
      $set: req.body
    },
    {
      new: true
    })

  if (!product) {
    throw new ApiError(404, "product is not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "successfully updated Product"))
})

export {
  createProduct,
  fecthProductWithSorting,
  fetchProductById,
  updateProduct,
}