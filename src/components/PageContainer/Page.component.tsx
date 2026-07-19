"use client";

import { forwardRef, type Ref } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";

const PageContainer = forwardRef(
  (
    { children, testId }: PropsWithChildrenOnly & { testId?: string },
    ref: Ref<HTMLDivElement>,
  ) => (
    <div className="grid" data-testid={testId} ref={ref}>
      <Header />
      <div className="content">{children}</div>
    </div>
  ),
);

PageContainer.displayName = "PageContainer";

export { PageContainer };
export default PageContainer;
