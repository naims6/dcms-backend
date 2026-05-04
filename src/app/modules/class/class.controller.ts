import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { ClassService } from "./class.service";

const createClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassService.createClass(req.body);

  return res.status(200).json({
    
  })

  return result;
});

export const ClassController = {
  createClass,
};
