import styled from "styled-components";
import { H1, P } from "src/components/Typography";

const HomeBio = styled(P)`
  max-width: 74ch;
  margin: 0;
  padding: 0;
`;

export const Bio = () => (
  <div>
    <H1>Hi, I'm Wade.</H1>
    <HomeBio>
      I'm a software engineer for{" "}
      <a href="https://www.gotrhythm.com" target="_blank" rel="noreferrer">
        Rhythm
      </a>
      , helping build the best customer experience in retail renewable energy,
      while currently living in Washington, D.C. My hobby project is{" "}
      <a href="https://filtermydisco.gs" target="_blank" rel="noreferrer">
        FilterMyDisco.gs
      </a>
      , a new Discogs collection management tool. Here's my{" "}
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
      <a rel="me" href="https://mastodon.online/@wade">
        Mastodon
      </a>
      , and all other links{" "}
      <a href="https://linktr.ee/wadehammes" target="_blank" rel="noreferrer">
        here
      </a>
      .
    </HomeBio>
  </div>
);
