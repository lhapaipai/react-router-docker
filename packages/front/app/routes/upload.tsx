import { useState } from "react";
import { createUppy } from "~/lib/uppy/instance";
import { InputFile } from "~/domain/media/components/InputFile";

export default function Component() {
  const [uppy] = useState(createUppy);

  return (
    <div>
      <h1>Example Upload</h1>
      <InputFile
        onPick={(media) => {
          console.log("onPick", media);
        }}
      />
      {/* <Dashboard theme="dark" uppy={uppy} />; */}
    </div>
  );
}
