import { GoogleAnalytics } from "@next/third-parties/google";
import { Space_Mono } from "next/font/google";
import { SpiralsProvider } from "src/contexts/SpiralsContext";
import "src/styles/critical.css";
import "src/styles/global.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
  preload: true,
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceMono.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
      </head>
      <body>
        <SpiralsProvider>
          <main>{children}</main>
        </SpiralsProvider>
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_KEY as string} />
      </body>
    </html>
  );
}
