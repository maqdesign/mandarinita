# Mandarinita · .ART Award 2026 — release gate

**Status: NOT RELEASED.** This file is a release checklist, not approval to publish.

## Submission constraints (official: https://www.award.art/)
- Deadline: **November 1, 2026** (verify cutoff time in the official submission form).
- Entry: a public `.art` URL with an English artist biography (at least 100 words), high-quality original works documented with **medium, materials, dimensions and tools/software when applicable**, and a narrative describing creative process (at least 100 English words).
- The actual submission is a separate manual step; shipping the website is **not** submitting the candidacy.

## Source of truth
- Integration branch: `feat/instagram-episode-catalog` (draft PR #3), based on `feat/mandarinita-art-2026`.
- Backed-up pre-release `main`: `backup/pre-award-2026-10-30-main`.
- Cloudflare Pages project `mandarinita` has production branch `main`. Staging preview: https://feat-instagram-episode-catalog.mandarinita-bbb.pages.dev/
- Existing historic `mandarinita.art` must remain in service until the replacement is tested and approved. At audit time, `mandarinita.art` was **not** in the Pages custom-domains list or as a Cloudflare DNS zone on this account.
- Official logotype is `assets/mandarinita-logo.svg`; no AI-generated artworks are used in this candidate.

## Checks — all must pass before changing production
- [x] Backup created from the original `main`.
- [x] English biography and story copy are each at least 100 words; checked in CI.
- [x] Local editorial catalog validation; checked in CI.
- [x] Technical artwork descriptions with original pixel dimensions; software not documented is explicitly disclosed rather than invented.
- [ ] Automated desktop/tablet/mobile smoke test passes on the latest commit.
- [ ] Human visual review of portfolio/hero and actual original artwork (no distorted brand characters) on mobile and desktop.
- [ ] Recheck all artwork captions and descriptions in English and verify all image files load.
- [ ] Approve the precise commit SHA to release; verify its parent and no unrelated modifications.
- [ ] Publish approved commit on `main` only after checks; leave PR #3 draft or explicitly decide whether to merge (do not accidentally import an unapproved Instagram catalog).
- [ ] Configure custom .ART hostname in Pages / registrar only after old DNS records, Worker and rollback pathway are documented. Do not blindly remove old Worker.
- [ ] Confirm public `https://mandarinita.art/` renders the new content, HTTPS valid, no redirect loops, English for a first-time visitor; `?lang=es` remains accessible.
- [ ] Submit `mandarinita.art` in the official application form, with the owner's confirmation; keep the receipt/screenshot.

## Important editorial caveats
- La mosca (2019) has 4 original pages, but only 2 are recovered. The web must say partial archive, **not** complete episode.
- No imported Instagram posts are auto-published; do not set incomplete catalog records to `published`.
- The hero must use authentic original illustrations; do not regenerate characters or logotype.
- Maintain Yosdina García and Mauricio Quezada credits.

## Rollback
- Git fallback reference: `backup/pre-award-2026-10-30-main`.
- Old historic public site and its Worker / DNS configuration are preserved unless deliberately changed during the approved release.
- If anything fails after switch, restore the prior production commit **and** previous routing/DNS settings and verify the original site again. Never describe a successful rollback without testing the public hostname.
