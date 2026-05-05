export interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
  error?: string;
}

export interface TPaginationQuery {
  page?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}
