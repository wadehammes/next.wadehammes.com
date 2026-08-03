"use client";

import classNames from "classnames";
import { forwardRef, type Ref } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";
import styles from "src/components/PageContainer/Page.module.css";

export interface PageContainerProps extends PropsWithChildrenOnly {
  contentAlign?: "bottom" | "top";
  testId?: string;
}

const PageContainer = forwardRef(
  (
    { children, contentAlign = "bottom", testId }: PageContainerProps,
    ref: Ref<HTMLDivElement>,
  ) => (
    <div
      className={classNames("grid", {
        [styles.gridTop]: contentAlign === "top",
      })}
      data-testid={testId}
      ref={ref}
    >
      <Header compact={contentAlign === "top"} />
      <div
        className={classNames("content", {
          [styles.contentTop]: contentAlign === "top",
        })}
      >
        {children}
      </div>
    </div>
  ),
);

PageContainer.displayName = "PageContainer";

export { PageContainer };
export default PageContainer;
