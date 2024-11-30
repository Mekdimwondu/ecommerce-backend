import { Request, Response } from "express";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { Prisma } from "@prisma/client";
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

export const searchProducts = async (req: Request, res: Response) => {
  const searchTerm = req.query.q?.toString() || ""; // Assuming you're getting the search term from the query parameter
  try {
    if (!searchTerm) {
      // If no search term is provided, respond with a 400 error (Bad Request)
      return res.status(400).json({
        message: "No search term provided.",
        errorCode: ErrorCode.INVALID_SEARCH_TERM,
      });
    }

    // Perform the query with search_vector cast to text
    const products = await prismaClient.$queryRaw<Product[]>(
      Prisma.sql`
        SELECT name, description, tags, search_vector::text 
        FROM "products"
        WHERE search_vector @@ plainto_tsquery('english', ${searchTerm})
      `
    );

    // If no products are found, return an empty array with a message (successful 200 response)
    if (products.length === 0) {
      return res.status(200).json({
        message: "No similar items found.",
        data: [],
      });
    }

    // If products are found, return them in the response
    res.status(200).json(products);
  } catch (error) {
    // In case of any error, return a 500 error with an appropriate message
    console.error("Error during product search:", error);
    res.status(500).json({
      message: "Search failed due to an internal error.",
      errorCode: ErrorCode.UNPROCESSABEL_ENTITY,
    });
  }
};
