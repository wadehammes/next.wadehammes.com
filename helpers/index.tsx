export type Entries = {
  includes: {
    Asset: object[],
    Entry: [{sys: object, fields: object}],
  },
  items: [{fields: object, sys: object}],
  limit: number,
  skip: number,
  sys: object,
  total: number,
};

export type WorkEntry = {
  fields: {
    categories?: object[],
    copy: {
      content: object[],
    },
    dateCompleted?: string,
    displayTitle: string,
    meta?: {
      fields: {
        metaKeyword: string,
        metaDescription: string,
      },
    },
    slug: string,
    title: string,
    excerpt?: string,
    siteUrl?: string,
    gallery?: [
      {
        fields: {
          file: {
            url: string,
            contentType: string,
            details: {
              size: number,
              image: {
                width: number,
                height: number,
              },
            },
          },
          title: string,
        },
      },
    ],
  },
};

export const normalizedWorkEntry = (entry: WorkEntry): WorkEntry => entry;
