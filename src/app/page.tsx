export default function Home() {
  return (
    <main className="paper-texture min-h-screen space-y-6 p-10">
      <h1 className="font-serif-editorial text-4xl text-ink">
        Escribe hoy a la persona en la que te convertirás.
      </h1>
      <p className="font-letter">Querido yo del futuro…</p>
      <div className="flex gap-3">
        <span className="size-12 rounded-full bg-wax" />
        <span className="size-12 border border-crease bg-manila" />
        <span className="size-12 bg-ink" />
      </div>
    </main>
  );
}