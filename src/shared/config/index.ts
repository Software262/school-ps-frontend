import { z } from 'zod';

const EnvSchema = z.object({
  baseApi: z.coerce.string(),
});

export const env = EnvSchema.parse({
  baseApi: import.meta.env.VITE_API_URL,
});
