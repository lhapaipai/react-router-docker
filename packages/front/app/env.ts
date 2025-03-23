import { z } from "zod";

const StringWithIntegerSchema = z
  .string()
  .refine((val) => /^-?\d+$/.test(val), { message: "Must be a string containing an integer" });

const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string(),
  PUBLIC_URL: z.string(),
  TUS_ENDPOINT: z.string(),

  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET: z.string(),
  S3_REGION: z.string(),
  S3_API_ENDPOINT: z.string(),
  S3_BUCKET_ENDPOINT: z.string(),
  S3_BUCKET_IS_PUBLIC: z.enum(["true", "false"]),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function initEnv() {
  const parsed = schema.safeParse(process.env);
  if (parsed.success === false) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
}

export function getPublicEnvs() {
  return {
    MODE: process.env.NODE_ENV,
    PUBLIC_URL: process.env.PUBLIC_URL,
    TUS_ENDPOINT: process.env.TUS_ENDPOINT,
    S3_BUCKET_ENDPOINT: process.env.S3_BUCKET_ENDPOINT,
    S3_BUCKET_IS_PUBLIC: process.env.S3_BUCKET_IS_PUBLIC,
  };
}

export type ENV = ReturnType<typeof getPublicEnvs>;

declare global {
  // eslint-disable-next-line no-var
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
