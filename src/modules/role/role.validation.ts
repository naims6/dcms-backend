import z from "zod";

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(50, "Role name too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers, and underscores in role name",
    ),

  description: z.string().max(100, "Description too long").optional(),

  permissionIds: z
    .array(z.number("Permission ids must be numbers"))
    .min(1, "At least one permission is required")
    .max(50, "Too many permissions"),
});

// Type inferred from schema
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
