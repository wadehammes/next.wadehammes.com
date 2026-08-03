"use client";

import classNames from "classnames";
import styles from "src/components/Links/LinkCard.module.css";
import { LinkFavicon } from "src/components/Links/LinkFavicon.component";
import { SoundCloudLinkCard } from "src/components/Links/SoundCloudLinkCard.component";
import { YouTubeLinkCard } from "src/components/Links/YouTubeLinkCard.component";
import type { ParsedLinkItem } from "src/prismic/parseLinks";

export interface LinkCardProps {
  item: ParsedLinkItem;
}

export const LinkCard = ({ item }: LinkCardProps) => {
  if (item.kind === "youtube") {
    return <YouTubeLinkCard item={item} />;
  }

  if (item.kind === "soundcloud") {
    return <SoundCloudLinkCard item={item} />;
  }

  return (
    <li className={styles.item}>
      <a
        className={classNames(styles.card, styles.cardWithIcon)}
        data-link-card=""
        href={item.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <LinkFavicon href={item.href} />
        <span className={styles.cardBody}>
          <span className={styles.label}>{item.label}</span>
          {item.description ? (
            <span className={styles.description}>{item.description}</span>
          ) : null}
        </span>
      </a>
    </li>
  );
};

export default LinkCard;
