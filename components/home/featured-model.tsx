'use client';

import ModelViewer from 'components/product/model-viewer';

export default function FeaturedModel() {
  // Hier wird der Pfad zum 3D-Modell angegeben, das auf der Startseite angezeigt werden soll
  const defaultModelPath = '/models/creme/together.stl';

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="flex flex-col items-center">
        <h2 className="mb-6 text-2xl font-bold">Entdecken Sie unsere 3D Leuchten</h2>
        <div className="w-full max-w-2xl">
          <ModelViewer modelPath={defaultModelPath} />
        </div>
        <div className="mt-4 text-center">
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Erleben Sie die einzigartige Eleganz unserer LayerLight Kollektion
          </p>
          <a
            href="/product/layerlight-tischlampe"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Jetzt entdecken
          </a>
        </div>
      </div>
    </section>
  );
}
