"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import { buildFaviconUrl } from "src/helpers/favicon";

export interface LinkFaviconProps {
  href: string;
}

export const LinkFavicon = ({ href }: LinkFaviconProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const faviconUrl = buildFaviconUrl(href);

  if (!faviconUrl || isHidden) {
    return null;
  }

  return (
    <Image
      alt=""
      className={styles.favicon}
      height={20}
      onError={() => {
        setIsHidden(true);
      }}
      src={faviconUrl}
      unoptimized
      width={20}
    />
  );
};

export default LinkFavicon;
