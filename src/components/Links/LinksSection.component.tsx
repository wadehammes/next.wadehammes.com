import { LinkCard } from "src/components/Links/LinkCard.component";
import styles from "src/components/Links/LinksPage.module.css";
import type { ParsedLinkSection } from "src/prismic/parseLinks";

export interface LinksSectionProps {
  section: ParsedLinkSection;
}

export const LinksSection = ({ section }: LinksSectionProps) => (
  <section className={styles.section}>
    {section.title ? (
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      </div>
    ) : null}
    <ul className={styles.linkList}>
      {section.items.map((item) => (
        <LinkCard item={item} key={`${item.href}-${item.label}`} />
      ))}
    </ul>
  </section>
);

export default LinksSection;
