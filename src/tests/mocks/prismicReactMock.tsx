import type { RichTextField } from "@prismicio/client";

export const prismicRichTextTestId = "rhPrismicRichText";

/** Lightweight PrismicRichText stand-in for JSDOM specs. */
export const PrismicRichText = ({ field }: { field: RichTextField }) => (
  <div data-testid={prismicRichTextTestId}>
    {field.map((node, index) =>
      "text" in node ? <span key={index}>{node.text}</span> : null,
    )}
  </div>
);
