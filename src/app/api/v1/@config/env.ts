import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const env = schema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment configuration:", env.error.flatten().fieldErrors);
}

export default env;
