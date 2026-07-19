import { beforeEach, describe, expect, it } from "@jest/globals";
import { BioPageObject } from "src/components/Bio/Bio.po";
import { screen } from "test-utils";

let po: BioPageObject;

describe("Bio", () => {
  beforeEach(() => {
    po = new BioPageObject();
  });

  it("renders nothing when copy is empty", () => {
    po.renderBio({ copy: po.buildEmptyCopy() });

    expect(screen.queryByTestId(po.testId)).not.toBeInTheDocument();
  });

  it("renders rich text when copy is filled", () => {
    po.renderBio({ copy: po.buildCopy() });

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(screen.getByText("Hi, I'm Wade.")).toBeInTheDocument();
    expect(screen.getByText("Personal site bio copy.")).toBeInTheDocument();
  });
});
