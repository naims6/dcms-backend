import { Response } from "express";
import { StatusCodes } from "http-status-codes";

interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

class ApiResponse {
  static success(
    res: Response,
    data: any,
    message: string = "Success",
    stautsCode: number = StatusCodes.OK,
  ) {
    return res.status(stautsCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    const response: { success: boolean; message: string; stack?: string } = {
      success: false,
      message,
    };

    if (process.env.NODE_ENV === "development") {
      response.stack = error.stack || "";
    }

    return res.status(statusCode).json(response);
  }

  static paginated(
    res: Response,
    data: any,
    pagination: PaginationOptions,
    message: string = "Success",
  ) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;
