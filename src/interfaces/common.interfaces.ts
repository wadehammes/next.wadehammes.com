export enum Environments {
  Local = "local",
  Staging = "staging",
  Production = "production",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entry = any | undefined;
export type EntryId = number | string;

export enum EntryTypes {
  WorkEntry = "workEntry",
}

export interface StaticEntry {
  id: EntryId;
  slug?: string;
}

export enum Alignment {
  Left = "Left",
  Center = "Center",
  Right = "Right",
}

export enum LinkTarget {
  Blank = "_blank",
  Self = "_self",
}

export interface AnimatedWrapperProps {
  wait?: number;
  animate?: boolean;
  index?: number;
}

export enum ContentStyleTypes {
  None = "None",
  Card = "Card",
  Outlined = "Outlined",
}

export interface MediaType {
  file: {
    url: string;
    contentType: string;
    details: {
      size: number;
      image: {
        width: number;
        height: number;
      };
    };
    fileName: string;
  };
  title: string;
}
