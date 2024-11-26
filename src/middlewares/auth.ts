import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
const authMiddlewere = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || "";
  if (!token) {
    next(
      new UnauthorizedException("Unauthorizaed user", ErrorCode.UNAUTHORIZED)
    );
  }
  try {
    const paylode = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: paylode.userId },
    });
    if (!user) {
      next(
        new UnauthorizedException("Unauthorizaed user", ErrorCode.UNAUTHORIZED)
      );
    }
    req.user = user as any;
    next();
  } catch (error) {
    next(
      new UnauthorizedException("Unauthorizaed user", ErrorCode.UNAUTHORIZED)
    );
  }
};

export default authMiddlewere;
