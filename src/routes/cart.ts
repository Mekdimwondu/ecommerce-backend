import { Router } from "express";
import authMiddlewere from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  addItemToCart,
  changeQuantity,
  getCart,
  removeToCart,
} from "../controllers/cart";

const cartRoutes: Router = Router();

cartRoutes.post("/", authMiddlewere, errorHandler(addItemToCart));
cartRoutes.get("/", authMiddlewere, errorHandler(getCart));
cartRoutes.delete("/:id", authMiddlewere, errorHandler(removeToCart));
cartRoutes.put("/:id", authMiddlewere, errorHandler(changeQuantity));

export default cartRoutes;
