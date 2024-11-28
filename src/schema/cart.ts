import { z } from "zod";

export const CreateCartSchema = z.object({
  productionId: z.number(),
  quantity: z.number(),
});
