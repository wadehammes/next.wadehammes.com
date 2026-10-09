"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import classNames from "classnames";
import Image from "next/image";
import { Activity, useState } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import { MediaPlaySegment } from "src/components/Links/MediaPlaySegment.component";
import { buildSoundCloudEmbedUrl } from "src/helpers/soundcloud";
import type { ParsedLinkItem } from "src/prismic/parseLinks";

export interface SoundCloudLinkCardProps {
  item: ParsedLinkItem;
}

export const SoundCloudLinkCard = ({ item }: SoundCloudLinkCardProps) => {
  const [open, setOpen] = useState(false);
  const activityName = `soundcloud-${item.href}`;

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
            {item.embedThumbnailUrl ? (
              <Image
                alt=""
                className={styles.thumbnail}
                height={72}
                src={item.embedThumbnailUrl}
                unoptimized
                width={72}
              />
            ) : (
              <span aria-hidden className={styles.thumbnailPlaceholder} />
            )}
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
            <Activity mode="visible" name={activityName}>
              <div className={styles.mediaCardPreview}>
                <div
                  className={classNames(styles.embed, styles.soundCloudEmbed)}
                >
                  <iframe
                    allow="autoplay"
                    className={styles.iframe}
                    src={buildSoundCloudEmbedUrl(item.href, true)}
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

export default SoundCloudLinkCard;
