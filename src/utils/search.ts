const searchQuery = (searchTerm: string, fields: string[]) => {
  const result = fields.map((field) => {
    return { [field]: { contains: searchTerm, mode: "insensitive" } };
  });
  return result;
};

export default searchQuery;
