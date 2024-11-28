import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
export const addItemToCart = async (req: Request, res: Response) => {
  //add cart if the product already in the cart and add this only add increment functinality
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity,
    },
  });
  res.json(cart);
};
export const removeItemToCart = async (req: Request, res: Response) => {
  // remove all item for cart
  // check if user is delete his cart
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json({ success: true });
};
export const changeQuantity = async (req: Request, res: Response) => {
  // check if user is updating his cart
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updateCart = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updateCart);
};
export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: { userId: req.user.id },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
