import type { Media } from "database";
import { z, type ZodObject, type ZodRawShape } from "zod";

export const ResizeOptionsSchema = z.object({
  width: z.coerce.number().int().optional(),
  height: z.coerce.number().int().optional(),
  fit: z.enum(["cover", "contain", "fill", "inside", "outside"]),
});

export type ResizeOptions = z.infer<typeof ResizeOptionsSchema>;

export function refineSchemaObjectWithMediaStrings<
  Schema extends ZodObject<ZodRawShape>,
  K extends string,
>(schema: Schema, mediaKeys: K[]): Omit<Schema, K> & { [Key in K]: typeof MediaStringSchema } {
  // @ts-ignore
  return schema.extend(createObjFromKeys(mediaKeys, MediaStringSchema));
}

function createObjFromKeys<K extends string, T>(keys: K[], value: T): { [Key in K]: T } {
  return Object.fromEntries(keys.map((key) => [key, value])) as { [Key in K]: T };
}

export const MediaStringSchema = z
  .string()
  .nullable()
  .default(null)
  .transform((val, ctx) => {
    const { media, errors } = parseMediaStringWithErrors(val);
    if (errors.length > 0) {
      errors.forEach((message) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
      });
      return z.NEVER;
    }

    return media;
  });

export const MediaSchema = z.object({
  id: z.string(),
  origin: z.enum(["s3", "local", "other"]),
  mimeType: z.string(),
  width: z.coerce.number().int().nullable().default(null),
  height: z.coerce.number().int().nullable().default(null),
  src: z.string().nullable().default(null),
  size: z.coerce.number().int().nullable().default(null),
});

export type MediaImage = Omit<Media, "width" | "height"> & {
  width: number;
  height: number;
};

export const parseMediaString = (mediaString: any, withZod = false) => {
  if (!mediaString) {
    return null;
  }
  let mediaJson: unknown;
  try {
    mediaJson = JSON.parse(mediaString);
  } catch (_err: unknown) {
    return null;
  }
  if (!withZod) {
    return mediaJson as Media | null;
  }
  const result = MediaSchema.safeParse(mediaJson);
  if (result.success) {
    return result.data;
  }

  return null;
};

export const parseMediaStringWithErrors = (mediaString: string | null) => {
  if (mediaString === null || mediaString === "") {
    return {
      media: null,
      errors: [],
    };
  }
  let mediaJson: unknown;
  try {
    mediaJson = JSON.parse(mediaString);
  } catch (_err: unknown) {
    return {
      media: null,
      errors: ["not a media stringified JSON"],
    };
  }
  const result = MediaSchema.safeParse(mediaJson);
  if (result.success) {
    return {
      media: result.data,
      errors: [],
    };
  }

  const errors = Object.entries(result.error.formErrors.fieldErrors).map(
    ([key, messages]) => `${key}: ${messages.join(" ")}`,
  );

  return {
    media: null,
    errors: errors.concat(result.error.formErrors.formErrors),
  };
};
