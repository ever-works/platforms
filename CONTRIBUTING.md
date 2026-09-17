# Contributing to the Ever platform catalog

Thanks for helping. This repository decides what the Ever Works App Launcher shows and where each tile
points, so a change here is visible to every person using the launcher.

## Adding or changing a platform

1. **Open a pull request that changes `platforms.json` and adds the icon in the same commit.** A row whose
   icon does not exist is an error, not a broken image.
2. **Use the real https address for every environment.** All three of `production`, `stage` and `develop`
   are required. If you do not have an address yet, write `TBD` — the validator will warn rather than fail,
   and the warning is the honest record that the value is still missing. Do not invent one.
3. **Keep the fields inside their limits:** `name` ≤ 40 characters, `description` ≤ 80, `order` 0..9999,
   `id` matching `^[a-z0-9-]{2,40}$`. The id is also the key a person's App Launcher preference is stored
   under (`platform:<id>`), so **changing an id loses every stored preference** — add a new entry and
   deprecate the old one instead.
4. **At most 24 entries.** Every additional platform is a per-entry decision with a named owner, not a
   batch one.
5. **Icons are ≤ 16 KiB**, `icons/<id>.svg` or `icons/<id>.png`. An SVG must contain no `<script>`, no
   `on<event>=`, no `javascript:` and no `<foreignObject>`.

## What CI checks

`.github/workflows/validate.yml` runs `npm run validate` on every pull request: the JSON Schema, unique
ids, the entry cap, every icon present and within its size cap, the SVG restrictions, and an https address
per environment. Run the same check locally before you push:

```bash
npm install
npm run validate
```

## Rules that are not negotiable

- **Never remove an entry to fix a problem.** Removing a platform removes it from everyone's launcher.
  Correct the entry, or set it to `beta`, and say why in the pull request.
- **No secrets and no credentials** — this repository holds addresses and names only.
- **No addresses other than `https`.** The launcher will not open anything else, and the schema rejects it.
- **Addresses belong here, not in platform code.** If you find yourself wanting to hardcode a URL in Ever
  Works, add it to this catalog instead.

## Commit messages

Short imperative subject, and a body line:

```
Refs: ever-works/ever-works App Works program
```
