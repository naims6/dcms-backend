import { TPaginationQuery } from "../types";

export const calculatePagination = (
  query: TPaginationQuery,
  defaultSortBy: string = "createdAt",
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || defaultSortBy;
  const sortOrder = query.sortOrder || "desc";

  return { page, limit, skip, sortBy, sortOrder };
};
