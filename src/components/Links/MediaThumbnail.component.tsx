"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import { getMediaThumbnailClipPaths } from "src/helpers/mediaThumbnailClipPath";

export interface MediaThumbnailProps {
  clipSeed: string;
  src: string | null;
}

const thumbnailClipStyle = (clipSeed: string): CSSProperties => {
  const clips = getMediaThumbnailClipPaths(clipSeed);

  return {
    ["--thumbnail-clip" as string]: clips.default,
    ["--thumbnail-clip-hover" as string]: clips.hover,
  };
};

export const MediaThumbnail = ({ clipSeed, src }: MediaThumbnailProps) => {
  const clipStyle = thumbnailClipStyle(clipSeed);

  if (!src) {
    return (
      <span
        aria-hidden
        className={styles.thumbnailPlaceholder}
        style={clipStyle}
      />
    );
  }

  return (
    <Image
      alt=""
      className={styles.thumbnail}
      height={68}
      src={src}
      style={clipStyle}
      unoptimized
      width={68}
    />
  );
};

export default MediaThumbnail;
