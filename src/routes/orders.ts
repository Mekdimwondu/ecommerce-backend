import { Router } from "express";
import authMiddlewere from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  cancelOrder,
  createOrder,
  getOrderbyId,
  listOrder,
} from "../controllers/orders";

const orderRoutes: Router = Router();
orderRoutes.post("/", authMiddlewere, errorHandler(createOrder));
orderRoutes.get("/", authMiddlewere, errorHandler(listOrder));
orderRoutes.put("/:id/cancel", authMiddlewere, errorHandler(cancelOrder));
orderRoutes.get("/:id", authMiddlewere, errorHandler(getOrderbyId));
export default orderRoutes;
