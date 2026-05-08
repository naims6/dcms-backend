const searchQuery = (searchTerm: string, fields: string[]) => {
  if (!searchTerm?.trim()) return undefined;
  if (!fields?.length) return undefined;
  // Sanitize and validate
  const sanitizedTerm = searchTerm
    .replace(/[<>%'"\\;]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 100);

  if (!sanitizedTerm) return undefined;

  return fields.map((field) => ({
    [field]: { contains: sanitizedTerm, mode: "insensitive" },
  }));
};

export default searchQuery;
