# Profile Plan

Working notes for the `vishak239/vishak239` profile repository.

## Source of truth

The profile mirrors the portfolio, `vishak-portfolio` (live at https://vishak-portfolio-gray.vercel.app).
Wording comes from `vishak-portfolio/src/data/portfolioContent.ts` on `master`, which already reconciles the
portfolio with the repositories (see `../../audit/portfolio-corrections.md`). The local copy at `C:ishak portfolio`
is two commits behind `origin/master` and still has the uncorrected text, so do not copy from it.

Brand: the portfolio's cinematic, editorial voice (acts and scenes, serif headlines, mono labels, the "V" mark),
rendered in red and black on GitHub.

## Structure

```text
README.md                    # profile README, assembled from the SVGs below
scripts/build-assets.mjs     # generates every SVG in assets/
assets/
  hero.svg                   # Act I: name, roles, portfolio headline, "now building" pill
  avatar.svg                 # the portfolio's V mark in red, for the GitHub profile picture
  btn-*.svg                  # Portfolio (filled), LinkedIn, Email, PrepPitch
  title-NN.svg / -light.svg  # section headers for dark / light theme (switched with <picture>)
  facts.svg                  # 01 About
  preppitch.svg              # 02 Currently building: prototype vs Django work
  card-*.svg                 # 03 Selected projects, two per row
  journey.svg                # 04 An AI Engineer's Journey (portfolio stages)
  experience.svg             # 05 Internships & roles
  education.svg              # 06
  stack.svg                  # 07 Skills; dashed = learning
  focus.svg                  # 08
  footer.svg                 # 10 Act III: the next chapter
```

Palette: background `#050505` / `#0B0B0B`, card `#100C0D`, red `#D7263D` / `#FF4D5E`, text `#F7F2F2`, muted `#ABA3A3`.
GitHub strips CSS from READMEs, so all styling lives inside the SVGs. Animations are CSS inside the SVGs, never hide
content on the first frame, and stop under `prefers-reduced-motion`. Text containing `&` must go through `esc()`.

## Updating

1. Edit the data in `scripts/build-assets.mjs` (e.g. `PROJECTS`, the `items` in `experience()` or the `rows` in `stack()`).
2. `node scripts/build-assets.mjs`
3. Update the matching `alt` text in `README.md` so the text version stays accurate.
4. Copy to the repo and commit:

   ```bash
   cp -r profile/README.md profile/assets profile/scripts profile/docs repositories/vishak239/
   ```

## Rules

- Only claim what a public repository or Vishak's own confirmation can support. Unpublished work is labelled "not yet public" or "in development".
- One stats card at most (the streak card; `github-readme-stats.vercel.app` is paused).
- A new project → add a `PROJECTS` entry and a card link in the README. A PrepPitch feature ships → move it in `preppitch()`. A "learning" skill used in a public repo → move it to the working list in `stack()`.

See `../../audit/profile-strategy.md` for the full strategy.
