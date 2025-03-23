import { InputFile } from "~/domain/media/components/InputFile";

export default function Component() {
  return (
    <div>
      <h1>Example Upload</h1>
      <InputFile
        onPick={(media) => {
          console.log("onPick", media);
        }}
      />
    </div>
  );
}
