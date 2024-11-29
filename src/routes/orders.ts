import { Router } from "express";
import authMiddlewere from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderbyId,
  listAllOrders,
  listOrder,
  listUserOrder,
} from "../controllers/orders";
import adminMiddleware from "../middlewares/admin";

const orderRoutes: Router = Router();
orderRoutes.post("/", authMiddlewere, errorHandler(createOrder));
orderRoutes.get("/", authMiddlewere, errorHandler(listOrder));
orderRoutes.put("/:id/cancel", authMiddlewere, errorHandler(cancelOrder));

orderRoutes.get(
  "/index",
  authMiddlewere,
  adminMiddleware,
  errorHandler(listAllOrders)
);
orderRoutes.get(
  "/users/:id",
  authMiddlewere,
  adminMiddleware,
  errorHandler(listUserOrder)
);
orderRoutes.put(
  "/:id/status",
  authMiddlewere,
  adminMiddleware,
  errorHandler(changeStatus)
);
orderRoutes.get("/:id", authMiddlewere, errorHandler(getOrderbyId));
export default orderRoutes;
