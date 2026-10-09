import Link from "next/link";
import styles from "src/components/Links/LinksPage.module.css";
import { LinksSections } from "src/components/Links/LinksSections.component";
import { ProfileAvatar } from "src/components/Links/ProfileAvatar.component";
import PageContainer from "src/components/PageContainer/Page.component";
import { SITE_TITLE } from "src/constants/site";
import type { ParsedLinksPage } from "src/prismic/parseLinks";
import Crown from "src/styles/icons/crown.svg";

export interface LinksPageProps {
  fallbackAvatarUrl?: string | null;
  linksPage?: ParsedLinksPage | null;
}

export const LinksPage = ({ fallbackAvatarUrl, linksPage }: LinksPageProps) => {
  const profileName = linksPage?.profileName ?? SITE_TITLE;
  const sections = linksPage?.sections ?? [];

  return (
    <PageContainer contentAlign="top" showHeader={false} testId="rhLinksPage">
      <div className={styles.pageShell}>
        <div className={styles.page}>
          <aside aria-label="Profile" className={styles.aside}>
            <div className={styles.profileCard}>
              <div className={styles.profileMark}>
                <div className={styles.avatarFrame}>
                  <ProfileAvatar
                    fallbackAvatarUrl={fallbackAvatarUrl}
                    image={linksPage?.profileImage}
                    name={profileName}
                  />
                  <Link
                    className={styles.homeLogo}
                    data-nav-link=""
                    href="/"
                    aria-label="Back to home"
                  >
                    <span className="crownWrapper">
                      <Crown />
                    </span>
                  </Link>
                </div>
              </div>
              <hgroup className={styles.hgroup}>
                <h1 className={styles.name}>{profileName}</h1>
                {linksPage?.tagline ? (
                  <p className={styles.tagline}>{linksPage.tagline}</p>
                ) : null}
              </hgroup>
            </div>
          </aside>

          <div className={styles.main}>
            {sections.length > 0 ? (
              <LinksSections sections={sections} />
            ) : (
              <p className={styles.empty}>
                Links will appear here once published in Prismic.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LinksPage;
