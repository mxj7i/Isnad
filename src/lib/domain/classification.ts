import { z } from "zod";

export const contentLevels = ["A", "B", "C", "D"] as const;

export const ContentLevelSchema = z.enum(contentLevels);

export type ContentLevel = z.infer<typeof ContentLevelSchema>;