import jwt from "jsonwebtoken";
import { prisma } from "./prismaInstance.js";

export const formatErrors = (error) =>
  error.details.map((err) => ({
    field: err.path[0],
    message: err.message,
  }));

export const createToken = (data) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });
};

export const checkIfExists = async (field, value) => {
  const user = await prisma.user.findUnique({
    where: { [field]: value },
  });
  return user;
};
