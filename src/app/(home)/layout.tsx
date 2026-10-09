import type { PropsWithChildrenOnly } from "src/@types/react";
import { SpiralsProvider } from "src/contexts/SpiralsContext";

export default function HomeLayout({ children }: PropsWithChildrenOnly) {
  return <SpiralsProvider>{children}</SpiralsProvider>;
}
