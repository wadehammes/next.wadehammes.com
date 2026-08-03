"use client";

import { LinkCard } from "src/components/Links/LinkCard.component";
import styles from "src/components/Links/LinksPage.module.css";
import { ProfileAvatar } from "src/components/Links/ProfileAvatar.component";
import PageContainer from "src/components/PageContainer/Page.component";
import { SITE_TITLE } from "src/constants/site";
import type { ParsedLinksPage } from "src/prismic/parseLinks";

export interface LinksPageProps {
  fallbackAvatarUrl?: string | null;
  linksPage?: ParsedLinksPage | null;
}

export const LinksPage = ({ fallbackAvatarUrl, linksPage }: LinksPageProps) => {
  const profileName = linksPage?.profileName ?? SITE_TITLE;
  const sections = linksPage?.sections ?? [];

  return (
    <PageContainer contentAlign="top" testId="rhLinksPage">
      <div className={styles.page}>
        <div className={styles.profile}>
          <ProfileAvatar
            fallbackAvatarUrl={fallbackAvatarUrl}
            image={linksPage?.profileImage}
            name={profileName}
          />
          <h1 className={styles.name}>{profileName}</h1>
          {linksPage?.tagline ? (
            <p className={styles.tagline}>{linksPage.tagline}</p>
          ) : null}
        </div>

        {sections.length > 0 ? (
          <div className={styles.sections}>
            {sections.map((section) => (
              <section
                className={styles.section}
                key={section.title ?? section.items[0]?.label}
              >
                {section.title ? (
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                ) : null}
                <ul className={styles.linkList}>
                  {section.items.map((item) => (
                    <LinkCard item={item} key={`${item.href}-${item.label}`} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            Links will appear here once published in Prismic.
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default LinksPage;
