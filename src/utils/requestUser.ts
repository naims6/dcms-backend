import { Request } from "express";

export const getUser = (req: Request) => {
  if (!req.user) {
    throw new Error("User not found in request");
  }
  return req.user;
};

export const getUserId = (req: Request) => {
  if (!req.user) {
    throw new Error("User not found in request");
  }
  return req.user.id;
};
