import Uppy, { type Meta } from "@uppy/core";
import Tus, { type TusBody } from "@uppy/tus";
import ImageEditor from "@uppy/image-editor";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import ImageDimension from "./ImageDimension";
import { getPublicEnv } from "../util/env";

export function createUppy() {
  return new Uppy<Meta, TusBody>({
    debug: true,
    allowMultipleUploadBatches: false,
  })
    .use(Tus, {
      endpoint: getPublicEnv("TUS_ENDPOINT"),
      removeFingerprintOnSuccess: true,
    })
    .use(ImageDimension, {
      uploadAfterCrop: false,
    })
    .use(ImageEditor, {
      actions: {
        cropSquare: false,
        cropWidescreen: false,
        cropWidescreenVertical: false,
      },
    });
}
