"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import classNames from "classnames";
import Image from "next/image";
import { Activity, useState } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import { MediaPlaySegment } from "src/components/Links/MediaPlaySegment.component";
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
} from "src/helpers/youtube";
import type { ParsedLinkItem } from "src/prismic/parseLinks";

export interface YouTubeLinkCardProps {
  item: ParsedLinkItem;
}

export const YouTubeLinkCard = ({ item }: YouTubeLinkCardProps) => {
  const videoId = item.youtubeVideoId;
  const [open, setOpen] = useState(false);

  if (!videoId) {
    return null;
  }

  return (
    <li className={classNames(styles.item, styles.itemMedia)}>
      <Collapsible.Root
        className={classNames(
          styles.card,
          styles.mediaCard,
          styles.mediaCollapsible,
        )}
        onOpenChange={setOpen}
        open={open}
      >
        <Collapsible.Trigger
          className={styles.mediaCardToggle}
          data-link-card=""
        >
          <span className={styles.mediaCardMain}>
            <Image
              alt=""
              className={styles.thumbnail}
              height={72}
              src={buildYouTubeThumbnailUrl(videoId)}
              unoptimized
              width={72}
            />
            <span className={styles.videoBody}>
              <span className={styles.label}>{item.label}</span>
              {item.description ? (
                <span className={styles.description}>{item.description}</span>
              ) : null}
            </span>
          </span>
          <MediaPlaySegment />
        </Collapsible.Trigger>
        <Collapsible.Panel
          className={styles.mediaCollapsiblePanel}
          keepMounted={false}
        >
          {open ? (
            <Activity mode="visible" name={`youtube-${videoId}`}>
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
            </Activity>
          ) : null}
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
};

export default YouTubeLinkCard;
