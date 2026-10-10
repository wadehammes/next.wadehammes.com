"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import classNames from "classnames";
import { Activity, useEffect, useRef, useState } from "react";
import styles from "src/components/Links/LinkCard.module.css";
import { MediaPlaySegment } from "src/components/Links/MediaPlaySegment.component";
import { MediaThumbnail } from "src/components/Links/MediaThumbnail.component";
import { buildMixcloudEmbedUrl } from "src/helpers/mixcloud";
import { playMixcloudEmbed } from "src/helpers/mixcloudWidget.client";
import type { ParsedLinkItem } from "src/prismic/parseLinks";

export interface MixcloudLinkCardProps {
  item: ParsedLinkItem;
}

export const MixcloudLinkCard = ({ item }: MixcloudLinkCardProps) => {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activityName = `mixcloud-${item.href}`;

  useEffect(() => {
    if (!open || !iframeRef.current) {
      return;
    }

    void playMixcloudEmbed(iframeRef.current).catch(() => undefined);
  }, [open, item.href]);

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
            <MediaThumbnail clipSeed={item.href} src={item.embedThumbnailUrl} />
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
                <div className={classNames(styles.embed, styles.mixCloudEmbed)}>
                  <iframe
                    ref={iframeRef}
                    allow="autoplay"
                    className={styles.iframe}
                    src={buildMixcloudEmbedUrl(item.href, true)}
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

export default MixcloudLinkCard;
