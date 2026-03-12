import { NewArtworkForm } from "@/components/forms/new-artwork-form";

export default function NewArtworkPage() {
  return (
    <>
      <section className="mx-auto rounded-2xl border p-6 max-w-6xl">
        <h1 className="text-2xl font-semibold">Add new artwork</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Fill in the details below to save a new artwork.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-6xl">
        <NewArtworkForm />
      </section>
    </>
  );
}
