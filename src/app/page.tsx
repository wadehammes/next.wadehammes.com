import type { Metadata } from "next";
import { HomePage } from "src/components/HomePage/HomePage.component";

export function generateMetadata(): Metadata {
  return {
    title: "Wade Hammes - Software Engineer / Fun Guy",
    metadataBase: new URL("https://wadehammes.com/"),
    creator: "Wade Hammes",
    publisher: "Wade Hammes",
    description:
      "Wade Hammes is a senior software engineer for Rhythm Energy, helping build the best customer experience in retail renewable energy, and a co-founder of Provisioner, a full-service creative agency helping grow brands. He is also a pretty fun guy.",
  };
}

const Home = () => {
  return <HomePage />;
};

export default Home;
