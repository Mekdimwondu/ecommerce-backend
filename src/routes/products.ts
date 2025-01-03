import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProduct,
  searchProducts,
  updateProduct,
} from "../controllers/products";
import authMiddlewere from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
const productsRoutes: Router = Router();
productsRoutes.post(
  "/",
  authMiddlewere,
  adminMiddleware,
  errorHandler(createProduct)
);
productsRoutes.put(
  "/:id",
  authMiddlewere,
  adminMiddleware,
  errorHandler(updateProduct)
);
productsRoutes.delete(
  "/:id",
  authMiddlewere,
  adminMiddleware,
  errorHandler(deleteProduct)
);
productsRoutes.get(
  "/",
  authMiddlewere,
  adminMiddleware,
  errorHandler(listProduct)
);
productsRoutes.get("/search", authMiddlewere, errorHandler(searchProducts));
productsRoutes.get(
  "/:id",
  authMiddlewere,
  adminMiddleware,
  errorHandler(getProductById)
);
export default productsRoutes;
