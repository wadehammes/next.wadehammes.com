import type {
  RichTextField,
  RTHeading1Node,
  RTParagraphNode,
} from "@prismicio/client";
import { BaseFactory } from "src/tests/factories/BaseFactory";

type RichTextFactoryOptions = Record<string, never>;

const buildHeading = (text: string): RTHeading1Node => ({
  direction: "ltr",
  spans: [],
  text,
  type: "heading1",
});

const buildParagraph = (text: string): RTParagraphNode => ({
  direction: "ltr",
  spans: [],
  text,
  type: "paragraph",
});

class RichTextFactory extends BaseFactory<
  RichTextField,
  RichTextFactoryOptions
> {
  build(
    attributes?: RichTextField,
    _options?: RichTextFactoryOptions,
  ): RichTextField {
    const instance: RichTextField = [
      buildHeading("Hi, I'm Wade."),
      buildParagraph("Personal site bio copy."),
    ];

    return attributes ?? instance;
  }

  buildEmpty(): RichTextField {
    return [];
  }

  buildHeading(text: string): RichTextField {
    return [buildHeading(text)];
  }
}

export const richTextFactory = new RichTextFactory();
