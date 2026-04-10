import type { RichTextField } from "@prismicio/client";
import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import styles from "src/components/Bio/Bio.module.css";

export interface BioProps {
  /** Rich Text from Prismic (e.g. Hero slice `copy`). */
  copy?: RichTextField | null;
}

export const Bio = ({ copy }: BioProps) => {
  if (!prismic.isFilled.richText(copy)) {
    return null;
  }

  return (
    <div className={styles.bioRichText}>
      <PrismicRichText field={copy} />
    </div>
  );
};

export default Bio;
