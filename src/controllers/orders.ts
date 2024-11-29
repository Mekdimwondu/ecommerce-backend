import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress ?? undefined,
      },
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address.formattedAddress,
        order_products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
        quantity: cartItems.length,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(order);
  });
};

export const listOrder = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
        quantity: 0,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const getOrderbyId = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        order_products: true,
        order_event: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClauth = {};
  const status = req.query.status;
  if (status) {
    whereClauth = { status };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClauth,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
        quantity: 1,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const listUserOrder = async (req: Request, res: Response) => {
  let whereClauth: any = {
    userId: +req.params.id,
  };
  const status = req.params.status;
  if (status) {
    whereClauth = {
      ...whereClauth,
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClauth,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  res.json(orders);
};
