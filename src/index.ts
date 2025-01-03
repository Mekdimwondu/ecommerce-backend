import express, { Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schema/users";
import productsRoutes from "./routes/products";

const app = express();
app.use(express.json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne},${addr.lineTwo},${addr.city},${addr.country},${addr.pincode}`;
        },
      },
    },
  },
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`express run in localhost:${PORT}`);
});
