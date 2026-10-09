"use client";

import classNames from "classnames";
import type { Ref } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";
import styles from "src/components/PageContainer/Page.module.css";

export interface PageContainerProps extends PropsWithChildrenOnly {
  contentAlign?: "bottom" | "top";
  ref?: Ref<HTMLDivElement>;
  showHeader?: boolean;
  testId?: string;
}

export const PageContainer = ({
  children,
  contentAlign = "bottom",
  ref,
  showHeader = true,
  testId,
}: PageContainerProps) => (
  <div
    className={classNames("grid", {
      [styles.gridTop]: contentAlign === "top" && showHeader,
      [styles.gridNoHeader]: !showHeader,
    })}
    data-testid={testId}
    ref={ref}
  >
    {showHeader ? <Header compact={contentAlign === "top"} /> : null}
    <div
      className={classNames("content", {
        [styles.contentTop]: contentAlign === "top",
      })}
    >
      {children}
    </div>
  </div>
);

export default PageContainer;
