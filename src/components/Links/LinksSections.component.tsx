import styles from "src/components/Links/LinksPage.module.css";
import { LinksSection } from "src/components/Links/LinksSection.component";
import type { ParsedLinkSection } from "src/prismic/parseLinks";

export interface LinksSectionsProps {
  sections: ParsedLinkSection[];
}

export const LinksSections = ({ sections }: LinksSectionsProps) => (
  <div className={styles.sections}>
    {sections.map((section, index) => {
      const key = `${section.title ?? "section"}-${section.items[0]?.href ?? index}`;

      return <LinksSection key={key} section={section} />;
    })}
  </div>
);

export default LinksSections;
