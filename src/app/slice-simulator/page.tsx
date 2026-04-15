import type { SliceSimulatorParams } from "@prismicio/next";
import SliceSimulatorPageClient from "src/app/slice-simulator/SliceSimulatorPageClient";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;

  return <SliceSimulatorPageClient initialState={state} />;
}
