import Uppy, { BasePlugin } from "@uppy/core";
import type { Body, Meta, PluginOpts, UppyFile } from "@uppy/core";

export interface ImageMeta extends Meta {
  width: number | null;
  height: number | null;
}

async function getImgDimension<M extends Meta, B extends Body>(
  imgFile: UppyFile<M, B>,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(imgFile.data);
    const img = new Image();
    img.addEventListener("load", () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.width,
        height: img.height,
      });
    });
    img.addEventListener("error", reject);
    img.addEventListener("abort", reject);
    img.src = url;
  });
}

interface ImageDimensionOptions extends PluginOpts {
  uploadAfterCrop?: boolean;
}

export default class ImageDimension<M extends Meta, B extends Body> extends BasePlugin<
  ImageDimensionOptions,
  M,
  B
> {
  constructor(uppy: Uppy<M, B>, opts?: ImageDimensionOptions) {
    super(uppy, opts);
    this.id = this.opts.id || "ImageDimension";
    this.type = "modifier";
  }
  install(): void {
    this.uppy.on("file-added", this.onFileAdded);
    this.uppy.on("file-editor:complete", this.onCropped);
  }
  uninstall(): void {
    this.uppy.off("file-added", this.onFileAdded);
    this.uppy.off("file-editor:complete", this.onCropped);
  }

  onFileAdded = async (file: UppyFile<M, B>) => {
    let addedMeta = false;
    if (file.type.startsWith("image/")) {
      try {
        const dimensions = await getImgDimension(file);
        console.log("attach dimension metadata", dimensions);
        this.uppy.setFileMeta(file.id, dimensions as unknown as M);
        addedMeta = true;
      } catch (_err) {
        // don't add metadata
      }
    }

    if (!addedMeta) {
      this.uppy.setFileMeta(file.id, {
        width: null,
        height: null,
      } as unknown as M);
    }
  };

  onCropped = async (file: UppyFile<M, B>) => {
    await this.onFileAdded(file);
    if (this.opts.uploadAfterCrop) {
      this.uppy.upload();
    }
  };
}
