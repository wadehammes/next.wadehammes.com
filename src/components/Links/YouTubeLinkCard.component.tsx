"use client";

import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
} from "src/helpers/youtube";
import type { ParsedLinkItem } from "src/prismic/parseLinks";

export interface YouTubeLinkCardProps {
  item: ParsedLinkItem;
}

export const YouTubeLinkCard = ({ item }: YouTubeLinkCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = item.youtubeVideoId;

  if (!videoId) {
    return null;
  }

  return (
    <li className={styles.item}>
      <div
        className={classNames(styles.card, styles.mediaCard, {
          [styles.cardActive]: isPlaying,
        })}
      >
        <button
          aria-expanded={isPlaying}
          className={styles.mediaCardToggle}
          data-link-card=""
          onClick={() => {
            setIsPlaying((open) => !open);
          }}
          type="button"
        >
          <Image
            alt=""
            className={styles.thumbnail}
            height={72}
            src={buildYouTubeThumbnailUrl(videoId)}
            unoptimized
            width={72}
          />
          <span className={styles.videoBody}>
            <span className={styles.labelRow}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.badge}>
                {isPlaying ? "Hide" : "Play"}
              </span>
            </span>
            {item.description ? (
              <span className={styles.description}>{item.description}</span>
            ) : null}
          </span>
        </button>
        {isPlaying ? (
          <div className={styles.mediaCardPreview}>
            <div className={styles.embed}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={styles.iframe}
                src={buildYouTubeEmbedUrl(videoId, true)}
                title={item.label}
              />
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default YouTubeLinkCard;
