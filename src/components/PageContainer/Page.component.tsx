"use client";

import { forwardRef, type Ref } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";

export const PageContainer = forwardRef(
  ({ children }: PropsWithChildrenOnly, ref: Ref<HTMLDivElement>) => (
    <div className="grid" ref={ref}>
      <Header />
      <div className="content">{children}</div>
    </div>
  ),
);

export default PageContainer;
