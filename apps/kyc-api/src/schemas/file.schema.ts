import { z } from 'zod';

export const shareLinkSchema = z.object({
  body: z.object({
    fileId: z.string(),
    expirationHours: z
      .number()
      .min(1, 'Expiration time must be at least 1 hour')
      .max(168, 'Expiration time cannot exceed 7 days'),
  }),
});

export const tagsSchema = z.object({
  body: z.object({
    tags: z
      .array(z.string())
      .min(1, 'At least one tag is required')
      .max(10, 'Maximum 10 tags allowed')
      .transform((tags) =>
        tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      ),
  }),
});
