import {
  getSlices,
  SliceSimulator,
  type SliceSimulatorParams,
} from "@prismicio/next";
import { SliceZone } from "@prismicio/react";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone slices={slices} />
    </SliceSimulator>
  );
}
