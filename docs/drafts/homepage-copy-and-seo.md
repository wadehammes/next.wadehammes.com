# Homepage bio & SEO revamp

Draft copy and metadata recommendations for [wadehammes.com](https://wadehammes.com). **Bio and Prismic SEO fields** are edited in the CMS (Home → Hero slice + SEO & Metadata tab). **Code fallbacks** in the repo apply when Prismic fields are empty.

---

## Audit (current state)

### Homepage bio (Prismic → Hero slice `copy`)

| | |
|---|---|
| **Heading** | Hi, I'm Wade. *(bold)* |
| **Body** | I'm a senior software engineer at Rhythm Energy, where I help build the best customer experience in retail renewable energy. On the side, I co-founded Provisioner, a creative agency that helps brands grow, and lately I've been building FilterMyDiscogs for fellow crate-diggers. Say hi: email · Github · Instagram · Bluesky · everything else. |

**Notes**

- Reads well; "on the side" and "lately I've been" soften the side projects compared to the day job.
- "help build the best customer experience" is a little marketing-heavy for a personal footer.
- Link set is complete and should stay.

### SEO & Metadata (Prismic)

| Field | Current value | Issue |
|---|---|---|
| **Meta title** | Wade Hammes' Party Pad | Fun, but weak for search and link previews when someone shares the URL professionally. Overrides the code fallback until changed in CMS. |
| **Meta description** | Wade Hammes is a senior software engineer for Rhythm Energy… He is also a pretty fun guy. | Third person is fine for SEO, but long (~200 chars, may truncate in SERPs). Closing line feels dated. Duplicated as the code fallback in `page.tsx`. |
| **Meta image** | *(empty)* | Field exists in Prismic and is parsed, but **`generateMetadata` did not use it**. Social previews rely on `src/app/opengraph-image.png` only. |

### Code & static metadata

| Location | Current | Issue |
|---|---|---|
| `src/app/page.tsx` | Title/description from Prismic with static fallbacks; no `openGraph` / `twitter` / canonical | Next.js infers some tags, but explicit OG/Twitter improves consistency when Prismic overrides title (e.g. "Party Pad"). |
| `src/app/manifest.ts` | Separate description (no "senior", no FilterMyDiscogs) | Out of sync with meta description. |
| `src/app/opengraph-image.alt.txt` | Wade Hammes - Software Engineer | Generic; could match revamp tone. |
| `src/app/robots.ts` | `https://www.wadehammes.com/sitemap.xml` | Served by [sitemap.ts](../../src/app/sitemap.ts) at build/runtime. |

---

## Proposed homepage bio (Prismic)

Paste into **Home → Hero section → Copy**. Keep the heading as **Heading 1** with the full line bold if you like the current style.

### Heading

**Hi, I'm Wade.**

### Body (single paragraph — matches current layout)

I'm a senior software engineer at [Rhythm Energy](https://www.gotrhythm.com/), where I build the customer experience for retail renewable energy. I co-founded [Provisioner](https://www.provisioner.agency/), a creative agency for growing brands, and I'm building [FilterMyDiscogs](https://filtermydisco.gs/) for fellow crate-diggers.

Say hi: [email](mailto:w@dehammes.com) · [Github](https://github.com/wadehammes) · [Instagram](https://instagram.com/wade) · [Bluesky](https://bsky.app/profile/wadehammes.com) · [everything else](https://www.wadehammes.com/links)

### Plain text (for quick edits)

```text
Hi, I'm Wade.

I'm a senior software engineer at Rhythm Energy, where I build the customer experience for retail renewable energy. I co-founded Provisioner, a creative agency for growing brands, and I'm building FilterMyDiscogs for fellow crate-diggers.

Say hi: email · Github · Instagram · Bluesky · everything else.
```

### Optional variant (two paragraphs in CMS)

Same links; splits project work from contact line for slightly easier scanning on wide viewports:

```text
I'm a senior software engineer at Rhythm Energy, where I build the customer experience for retail renewable energy. I co-founded Provisioner, a creative agency for growing brands, and I'm building FilterMyDiscogs for fellow crate-diggers.

Say hi: email · Github · Instagram · Bluesky · everything else.
```

### Tweaks to consider

- **Tone**: Add a short nod to this site ("generative spirals," "playground") if you want the footer to reflect the page itself.
- **Title at Rhythm**: "customer experience" vs "product" vs "engineering" — adjust if your role title matters for visitors.
- **FilterMyDiscogs**: "crate-diggers" is personality; drop it for a drier line if you prefer.

---

## Proposed SEO fields (Prismic → SEO & Metadata tab)

Copy these into Prismic when ready. Until then, live title/description stay whatever is published in the CMS.

| Field | Proposed value | Chars |
|---|---|---|
| **Meta title** | `Wade Hammes` | 11 |
| **Meta description** | `Senior software engineer at Rhythm Energy, co-founder of Provisioner, and builder of FilterMyDiscogs.` | ~100 |
| **Meta image** | *(optional)* Headshot or branded OG asset, 1200×630 | — |

### Meta title alternatives

| Option | When to use |
|---|---|
| `Wade Hammes` | Clean default; matches browser tab and search result title. **Recommended.** |
| `Wade Hammes · Software Engineer` | Adds role keyword without losing name prominence. |
| `Wade Hammes' Party Pad` | Keep only if you want search/social to stay playful; current live value. |

### Meta description alternatives

| Option | Text |
|---|---|
| **Recommended** | Senior software engineer at Rhythm Energy, co-founder of Provisioner, and builder of FilterMyDiscogs. |
| Shorter | Senior software engineer at Rhythm Energy. Co-founder of Provisioner. Builder of FilterMyDiscogs. |
| First person | Wade Hammes — senior software engineer at Rhythm Energy, co-founder of Provisioner, and builder of FilterMyDiscogs. |

---

## Code fallbacks (updated in repo)

These apply when Prismic fields are empty and keep manifest / OG alt / robots aligned:

| Location | Value |
|---|---|
| `src/constants/site.ts` | Shared `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL` |
| `src/app/page.tsx` | Full `openGraph`, `twitter`, canonical; uses Prismic `meta_image` when set |
| `src/app/manifest.ts` | Same description as meta fallback |
| `src/app/opengraph-image.alt.txt` | Wade Hammes — software engineer and co-founder of Provisioner |
| `src/app/robots.ts` | `https://www.wadehammes.com/sitemap.xml` |

---

## Checklist

- [ ] Review bio draft above; edit this file or paste final copy into Prismic Hero slice
- [x] Update Prismic **Meta title** and **Meta description** — draft pushed via Migration API; **publish in Prismic → Migration Releases**
- [ ] Optionally upload **Meta image** in Prismic for share cards (otherwise `opengraph-image.png` is used)
- [ ] Publish Home document in Prismic
- [ ] Verify: view source / [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / [Twitter Card Validator](https://cards-dev.twitter.com/validator) after deploy
- [ ] *(Done)* Sitemap is generated by `src/app/sitemap.ts` (home page only)
