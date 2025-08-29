/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const createWebinarSchema = z.object({
  webinarName: z.string().min(1).max(200),
  webinarLinkUserLink: z.string().url({ message: "Must be a valid URL" }),
  webinarHostLink: z.string().url({ message: "Must be a valid URL" }),
  webinarDate: z.coerce.date(),
  webinarDuration: z.number().int().min(1),
  enrolledUser: z
    .array(z.object({ email: z.string().email() }))
    .optional()
    .default([]),
});

export const updateWebinarSchema = createWebinarSchema.partial();

export const enrollSchema = z.object({
  email: z.string().email(),
});

export type CreateWebinarDTO = z.infer<typeof createWebinarSchema>;
export type UpdateWebinarDTO = z.infer<typeof updateWebinarSchema>;
export type EnrollDTO = z.infer<typeof enrollSchema>;

export const validate =
  <T>(schema: z.ZodSchema<T>) =>
  (req: any, _res: any, next: any) => {
    const data = ["POST", "PUT", "PATCH"].includes(req.method)
      ? req.body
      : req.query;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(", ");
      return next({ status: 400, message });
    }
    req.validated = parsed.data;
    return next();
  };
