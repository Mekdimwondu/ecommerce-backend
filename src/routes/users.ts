import { Router } from "express";
import authMiddlewere from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import {
  addAddress,
  deleteAddress,
  listAddress,
  updateUser,
} from "../controllers/useres";

const userRoutes: Router = Router();
userRoutes.post(
  "/address",
  authMiddlewere,

  errorHandler(addAddress)
);
userRoutes.delete(
  "/address/:id",
  authMiddlewere,

  errorHandler(deleteAddress)
);
userRoutes.get(
  "/address",
  authMiddlewere,

  errorHandler(listAddress)
);
userRoutes.put("/", authMiddlewere, errorHandler(updateUser));
export default userRoutes;
