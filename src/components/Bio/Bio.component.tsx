import styles from "src/components/Bio/Bio.module.css";

export const Bio = () => (
  <div>
    <h1>Hi, I'm Wade.</h1>
    <p className={styles.bio}>
      I'm a senior software engineer for{" "}
      <a href="https://www.gotrhythm.com" target="_blank" rel="noreferrer">
        Rhythm Energy
      </a>
      , helping build the best customer experience in retail renewable energy,
      and a co-founder of{" "}
      <a href="https://www.provisioner.agency" target="_blank" rel="noreferrer">
        Provisioner
      </a>
      , a full-service creative agency helping to grow brands. Here's my{" "}
      <a href="mailto:w@dehammes.com" target="_blank" rel="noreferrer">
        email
      </a>
      ,{" "}
      <a href="https://github.com/wadehammes" target="_blank" rel="noreferrer">
        Github
      </a>
      ,{" "}
      <a href="https://instagram.com/wade" target="_blank" rel="noreferrer">
        Instagram
      </a>
      ,{" "}
      <a
        href="https://bsky.app/profile/wadehammes.com"
        target="_blank"
        rel="noreferrer"
      >
        Bluesky
      </a>
      , and{" "}
      <a href="https://linktr.ee/wadehammes" target="_blank" rel="noreferrer">
        all other links
      </a>
      .
    </p>
  </div>
);

export default Bio;
