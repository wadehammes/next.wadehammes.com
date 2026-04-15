"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SliceSimulatorStateParam } from "./SliceSimulatorClient";

const SliceSimulatorClient = dynamic<{ state: SliceSimulatorStateParam }>(
  () => import("./SliceSimulatorClient"),
  { ssr: false },
);

type Props = {
  initialState: SliceSimulatorStateParam;
};

export default function SliceSimulatorPageClient({ initialState }: Props) {
  const searchParams = useSearchParams();
  const stateFromUrl = searchParams.get("state");
  const state = stateFromUrl ?? initialState;

  return <SliceSimulatorClient state={state} />;
}
