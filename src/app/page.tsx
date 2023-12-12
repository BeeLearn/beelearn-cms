"use client";

import MenuButton from "@/components/MenuButton";

function LayoutHeader() {
  return (
    <header className="flex space-x-2 items-center p-4">
      <MenuButton />
      <h1 className="flex-1 text-xl font-extrabold">Home</h1>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <LayoutHeader />
      <section className="flex-1 flex flex-col overflow-scroll p-2">
        <div className="flex-1 flex flex-col gap-4 md:flex-row">
          <div className="flex-1 grid grid-cols-1 gap-2">
            <div className="card" />
            <div className="card" />
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2">
            <div className="card flex-1 h-sm md:h-auto" />
            <div className="card !w-xs !h-sm" />
          </div>
        </div>
      </section>
    </>
  );
}
