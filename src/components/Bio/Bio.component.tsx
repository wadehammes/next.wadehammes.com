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
        Rhythm Energy
      </a>
      , helping build the best customer experience in retail renewable energy, a
      co-founder of{" "}
      <a href="https://www.provisioner.agency" target="_blank" rel="noreferrer">
        Provisioner
      </a>
      , the locally grown creative agency...all while living in Washington, D.C.
      Here's my{" "}
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
      , and{" "}
      <a href="https://linktr.ee/wadehammes" target="_blank" rel="noreferrer">
        all other links
      </a>
      .
    </HomeBio>
  </div>
);
