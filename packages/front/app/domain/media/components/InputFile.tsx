import { type ComponentProps, type RefObject, useMemo, useRef } from "react";
import DashboardModal from "@uppy/react/lib/DashboardModal";
import { useEffect, useState } from "react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";

import type { Meta, UppyFile } from "@uppy/core";
import type { TusBody } from "@uppy/tus";
import type { Media } from "database";
import { Button } from "pentatrion-design/button";
import { calculateDimensions } from "~/domain/media/util";
import { createPortal } from "react-dom";
import { isMediaImage, MediaPreview } from "pentatrion-design/media-preview";
import { getMediaImageSrc, presets } from "../presets";
import { ClientOnly } from "~/components/ClientOnly";
import { MediaStringSchema } from "../media.validation";
import { useStrictMergeRefs } from "pentatrion-design/hooks";

import clsx from "clsx";
import { createUppy } from "~/lib/uppy/instance";

export interface InputFileProps extends ComponentProps<"input"> {
  squareContainer?: boolean;
  onPick: (media: Media | null) => void;
  ref?: RefObject<HTMLInputElement>;
  mediaClassName?: string;
  className?: string;

  uppyPreset?: "free" | "image-with-ratio";
  allowedTypes?: "image" | "audio" | "all-safe";
  imageRatio?: number;
}

function getImportLabel(allowedTypes: "image" | "audio" | "all-safe") {
  switch (allowedTypes) {
    case "image":
      return "button.importImage";
    case "audio":
      return "button.importAudio";
    default:
      return "button.importFile";
  }
}

function getImportLabelIcon(allowedTypes: "image" | "audio" | "all-safe") {
  switch (allowedTypes) {
    case "image":
      return "fe-picture";
    case "audio":
      return "fe-music";
    default:
      return "fe-doc";
  }
}

export function InputFile({
  value,
  squareContainer = false,
  className,
  mediaClassName,
  onPick,

  uppyPreset = "free",
  allowedTypes = "all-safe",
  imageRatio,

  ref: externalRef,
  ...rest
}: InputFileProps) {
  const [uppy] = useState(() => createUppy());
  const [showUploader, setShowUploader] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null!);
  const ref = useStrictMergeRefs<HTMLInputElement>([externalRef, inputRef]);

  const media = useMemo(() => {
    const result = MediaStringSchema.safeParse(value);
    return result.success ? result.data : null;
  }, [value]);

  const thumbnailDimensions = isMediaImage(media)
    ? calculateDimensions(media, presets.preview)
    : null;

  useEffect(() => {
    function onUploadSuccess(
      uppyFile: UppyFile<Meta, TusBody> | undefined,
      response: { body?: TusBody | undefined; uploadURL?: string },
    ) {
      console.log(
        "onUploadSuccess !! xhrResponse:",
        response,
        JSON.parse(response.body?.xhr.responseText || "{}"),
        "uppyFile",
        uppyFile,
      );
      if (!response.uploadURL || !response.body || !uppyFile) {
        console.log("upload success but not uploadURL", uppyFile, response);
        return;
      }

      // const mediaInput = parseTusResponse(response.body.xhr.responseText);
      // console.log(mediaInput);

      // if (!mediaInput) {
      //   return;
      // }

      // fetch("/media/create", {
      //   method: "post",
      //   body: JSON.stringify(mediaInput),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => void onPick(data));
    }

    function onCancelFileEditor(uppyFile: UppyFile<Meta, TusBody> | undefined) {
      if (uppyFile && uppyPreset === "image-with-ratio") {
        uppy.removeFile(uppyFile.id);
      }
    }

    uppy.on("upload-success", onUploadSuccess);
    uppy.on("file-editor:cancel", onCancelFileEditor);

    return () => {
      uppy.off("upload-success", onUploadSuccess);
      uppy.off("file-editor:cancel", onCancelFileEditor);
    };
  }, [uppy, onPick, uppyPreset]);

  function handleCloseDashboard() {
    console.log("handleCloseDashboard");
    uppy.clear();
    setShowUploader(false);
  }

  return (
    <>
      <input
        className={clsx("hidden-focusable", className)}
        type="text"
        tabIndex={-1}
        ref={ref}
        value={value ?? ""}
        readOnly
        {...rest}
      />
      {media ? (
        <MediaPreview
          media={media}
          src={getMediaImageSrc(media, "preview")}
          width={thumbnailDimensions?.width}
          height={thumbnailDimensions?.height}
          squareContainer={squareContainer}
          className={mediaClassName}
        >
          <Button onClick={() => void onPick(null)} type="button" icon color="gray" size="large">
            <i className="fe-trash text-body-xl"></i>
          </Button>
        </MediaPreview>
      ) : (
        <div
          className={clsx(
            "outline-gray-2 flex aspect-(--media-ratio) flex-col items-center justify-center rounded-xl outline",
            mediaClassName,
          )}
          style={{ "--media-ratio": imageRatio ?? 16 / 9 }}
        >
          <i className={clsx("text-mega text-gray-2 mb-4", getImportLabelIcon(allowedTypes))}></i>
          <Button variant="light" type="button" onClick={() => setShowUploader((s) => !s)}>
            {getImportLabel(allowedTypes)}
          </Button>
          <ClientOnly>
            {() =>
              createPortal(
                <DashboardModal
                  open={showUploader}
                  onRequestClose={handleCloseDashboard}
                  uppy={uppy}
                  showProgressDetails={true}
                  proudlyDisplayPoweredByUppy={false}
                  closeModalOnClickOutside={true}
                  closeAfterFinish={true}
                  autoOpen={uppyPreset === "image-with-ratio" ? "imageEditor" : null}
                  hideUploadButton={uppyPreset === "image-with-ratio" ? true : false}
                />,
                document.body,
              )
            }
          </ClientOnly>
        </div>
      )}
    </>
  );
}
