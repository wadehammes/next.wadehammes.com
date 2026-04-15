"use client";

import { getSlices, SliceSimulator } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import { Bio } from "src/components/Bio/Bio.component";
import type { HeroSectionSlice } from "src/prismic/types/prismic.generated";

export type SliceSimulatorStateParam = Parameters<typeof getSlices>[0];

type Props = {
  /**
   * Serialized Slice Simulator state (from the `state` query param).
   * Typed from `getSlices()` to stay in sync with `@prismicio/next`.
   */
  state: SliceSimulatorStateParam;
};

export default function SliceSimulatorClient({ state }: Props) {
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone
        slices={slices}
        components={{
          hero_section: ({ slice }: { slice: HeroSectionSlice }) => (
            <Bio copy={slice.primary.copy} />
          ),
        }}
      />
    </SliceSimulator>
  );
}
