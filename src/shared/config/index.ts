import { z } from 'zod';

const EnvSchema = z.object({
  baseApi: z.coerce.string().default('http://localhost:8000/api/v1'),
});

export const env = EnvSchema.parse({
  baseApi: import.meta.env.VITE_BASE_API,
});
