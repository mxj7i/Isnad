import { z } from "zod";

const appConfigSchema = z.object({
  name: z.string().min(1),
  language: z.literal("ar"),
  direction: z.literal("rtl"),
});

export const appConfig = appConfigSchema.parse({
  name: "إسناد",
  language: "ar",
  direction: "rtl",
});