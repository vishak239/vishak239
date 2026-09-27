# Profile Plan

Working notes for the `vishak239/vishak239` profile repository.

## Structure

```text
README.md                    # profile README, assembled from the SVGs below
scripts/build-assets.mjs     # generates every SVG in assets/ from data at the top of each section
assets/
  hero.svg                   # animated banner: name, roles, tagline, "now building" pill, network graphic
  btn-*.svg                  # link buttons (LinkedIn, Email, PrepPitch, Portfolio)
  title-NN.svg               # section headers, dark theme
  title-NN-light.svg         # section headers, light theme (switched with <picture>)
  facts.svg                  # 01 About: four quick-fact tiles
  preppitch.svg              # 02 Currently building: prototype stages vs Django work
  card-*.svg                 # 03 Selected projects: six cards, shown two per row
  experience.svg             # 04 timeline
  education.svg              # 05
  stack.svg                  # 06 chips; dashed = learning
  focus.svg                  # 07 four focus tiles
  footer.svg                 # 09 contact banner
```

Palette: background `#050505` / `#0B0B0B`, card `#0E0E0D`, gold `#C9A227` / `#E6C45A`, text `#F5F1E8`, muted `#A9A39A`.
GitHub strips CSS from READMEs, so all styling lives inside the SVGs. Animations are CSS inside the SVGs, never hide content on the first frame, and stop under `prefers-reduced-motion`.

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
