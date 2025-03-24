// import { ResizeOptions } from "./dto";

import type { Media, Prisma } from "database";
import { type MediaImage, MediaSchema } from "./media.validation";
import { type TusResponseBody } from "~/types/tus";

interface ResizeOptions {
  width?: number;
  height?: number;
  fit: "cover" | "contain" | "fill" | "inside" | "outside";
}

export interface Dimensions {
  width: number;
  height: number;
}

export function isMedia(data: unknown): data is Media {
  const result = MediaSchema.safeParse(data);
  return result.success;
}

export function isImage(data: unknown): data is MediaImage {
  if (!isMedia(data)) {
    return false;
  }
  return data.width !== null && data.height !== null;
}

function parseSize(value: undefined | "null" | string) {
  if (!value || value === "null") {
    return null;
  }
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

function getOrigin(storage: TusResponseBody["storage"]) {
  switch (storage) {
    case "filestore":
      return "local";
    case "s3store":
      return "s3";
    default:
      return "other";
  }
}

export function parseTusResponse(responseText: string): Prisma.MediaCreateInput | null {
  try {
    const payload = JSON.parse(responseText) as TusResponseBody;
    const {
      id,
      type: mimeType,
      storage,
      width: rawWidth,
      height: rawHeight,
      size: rawSize,
    } = payload;
    const width = parseSize(rawWidth);
    const height = parseSize(rawHeight);
    const size = parseSize(rawSize);

    return {
      id,
      mimeType,
      origin: getOrigin(storage),
      size,
      width,
      height,
      src: null,
    };
  } catch (_err: unknown) {
    return null;
  }
}

export function calculateDimensions(original: Dimensions, options: ResizeOptions): Dimensions {
  const { fit, width, height } = options;
  if (!width && !height) {
    throw new Error("At least one of width or height must be provided.");
  }

  const aspectRatio = original.width / original.height;

  switch (fit) {
    case "fill":
      if (width && height) {
        return { width, height };
      } else if (width) {
        return {
          width: width,
          height: original.height,
        };
      } else {
        return {
          width: original.width,
          height: height!,
        };
      }

    case "contain": {
      if (width && height) {
        return { width, height };
      } else if (width) {
        return {
          width: width,
          height: Math.round(width / aspectRatio),
        };
      } else {
        return {
          width: Math.round(height! * aspectRatio),
          height: height!,
        };
      }
    }

    case "cover": {
      if (width && height) {
        return {
          width,
          height,
        };
      } else if (width) {
        return {
          width: width,
          height: Math.round(width / aspectRatio),
        };
      } else {
        return {
          width: Math.round(height! * aspectRatio),
          height: height!,
        };
      }
    }

    case "inside": {
      if (width && height) {
        const targetAspectRatio = width / height;
        if (targetAspectRatio > aspectRatio) {
          return {
            width: Math.min(original.width, Math.round(height * aspectRatio)),
            height: Math.min(original.height, height),
          };
        } else {
          return {
            width: Math.min(original.width, width),
            height: Math.min(original.height, Math.round(width / aspectRatio)),
          };
        }
      } else if (width) {
        return {
          width: Math.min(original.width, width),
          height: Math.min(original.height, Math.round(width / aspectRatio)),
        };
      } else {
        return {
          width: Math.min(original.width, Math.round(height! * aspectRatio)),
          height: Math.min(original.height, height!),
        };
      }
    }

    case "outside": {
      if (width && height) {
        const scale = Math.max(
          width ? width / original.width : 0,
          height ? height / original.height : 0,
        );
        return {
          width: Math.ceil(original.width * scale),
          height: Math.ceil(original.height * scale),
        };
      } else if (width) {
        return {
          width: width,
          height: Math.round(width / aspectRatio),
        };
      } else {
        return {
          width: Math.round(height! * aspectRatio),
          height: height!,
        };
      }
    }

    default:
      throw new Error(`Unsupported fit type: ${fit}`);
  }
}
