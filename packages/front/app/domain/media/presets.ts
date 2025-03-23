import type { Media } from "prisma-client";
import { getPublicEnv } from "~/lib/util/env";
import { type ResizeOptions } from "./media.validation";

export const presets = {
  raw: null,
  mini: {
    width: 100,
    height: 100,
    fit: "inside",
  },
  preview: {
    width: 600,
    height: 600,
    fit: "inside",
  },
} satisfies {
  [key: string]: ResizeOptions | null;
};

export type Preset = keyof typeof presets;

export function getMediaImageCustomSrc(media: Media | null, options?: ResizeOptions) {
  if (!media) {
    return;
  }

  return options
    ? `/media/get/custom/${media.id}?${new URLSearchParams(options as unknown as Record<string, string>).toString()}`
    : `/media/get/raw/${media.id}`;
}

export function getMediaImageSrc(media: Media | null, preset?: Preset) {
  if (!media) {
    return;
  }
  if (media.origin === "s3" && preset === "raw" && getPublicEnv("S3_BUCKET_IS_PUBLIC") === "true") {
    return `${getPublicEnv("S3_BUCKET_ENDPOINT")}/raw/${media.id}`;
  }

  return preset ? `/media/get/${preset}/${media.id}` : `/media/get/raw/${media.id}`;
}
