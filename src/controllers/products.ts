import { Request, Response } from "express";

import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const update = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new NotFoundException(
      "product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const deleteitem = await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json(deleteProduct);
  } catch (error) {
    throw new NotFoundException(
      "product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const listProduct = async (req: Request, res: Response) => {
  try {
    const skip = req.query.skip ? +req.query.skip : 0;
    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
      skip,
      take: 5,
    });
    res.json({ count, date: products });
  } catch (error) {
    throw new NotFoundException(
      "product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      "product not found.",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};
