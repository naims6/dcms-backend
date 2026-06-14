import z from "zod";

export interface IClass {
  name: string;
  numericValue: number;
}

export const createClassValidationSchema = z.object({
  name: z.string(),
  numericValue: z.number(),
});
