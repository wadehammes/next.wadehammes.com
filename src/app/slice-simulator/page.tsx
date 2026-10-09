import type { SliceSimulatorParams } from "@prismicio/next";
import { Suspense } from "react";
import SliceSimulatorPageClient from "src/app/slice-simulator/SliceSimulatorPageClient";

async function SliceSimulatorPageContent({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;

  return <SliceSimulatorPageClient initialState={state} />;
}

export default function SliceSimulatorPage(props: SliceSimulatorParams) {
  return (
    <Suspense fallback={null}>
      <SliceSimulatorPageContent {...props} />
    </Suspense>
  );
}
