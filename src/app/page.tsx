import { ImageConverter } from "@/components/image-converter";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Image Format Converter
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Convert your images to different formats with ease
          </p>
        </div>

        <ImageConverter />
      </div>
    </main>
  );
}
