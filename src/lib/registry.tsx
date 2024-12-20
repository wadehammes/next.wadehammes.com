"use client";

import { useServerInsertedHTML } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    styledComponentsStyleSheet.instance.clearTag();

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
