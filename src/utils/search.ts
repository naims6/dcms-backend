const searchQuery = (searchTerm: string, fields: string[]) => {
  if (!searchTerm.trim()) return undefined;

  const result = fields.map((field) => {
    return { [field]: { contains: searchTerm, mode: "insensitive" } };
  });
  return result;
};

export default searchQuery;
