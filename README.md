# Ever Works — platform catalog

**This repository is the catalog of Ever platforms.** Ever Works reads it to render the **Ever apps** in its
App Launcher: one tile per platform, in `order`, with the address for the environment Ever Works is running
in.

**Addresses are data in this repository — none of them appear in platform code.** Ever Works fetches
`platforms.json` from the raw host and then each referenced icon, so a change here is a change to every
launcher without a deploy.

> **Status: seed.** The three entries exist and validate, but **every address is still `TBD`**: they are
> owner-supplied and have not been provided yet. The validator reports each `TBD` as a warning, never as an
> error — inventing an address would be worse than saying plainly that it is missing. The icons are
> deliberate placeholders, not brand marks. See **Placeholders** below.

---

## What lives here

```
platforms.json                     the index — the only file Ever Works reads
icons/<id>.svg|png                 one per entry, ≤ 16 KiB
schema/platforms.schema.json       the index's JSON Schema (draft 2020-12)
tools/validate-platforms.mjs       the CI gate, runnable locally
.github/workflows/validate.yml     runs it on push to main and on every pull request
README.md · CONTRIBUTING.md · LICENSE (MIT)
```

## How it is read

| Setting | Default | Meaning |
| --- | --- | --- |
| `EVER_WORKS_PLATFORM_CATALOG_REPO` | `ever-works/platforms` | Must match `^ever-works/[a-z0-9-]+$` — the containment rule that stops a hostile configuration pointing the platform at someone else's code. |
| `EVER_WORKS_PLATFORM_CATALOG_REF` | `main` | Pin this to a tag or a 40-character SHA in production. |
| `EVER_WORKS_PLATFORM_CATALOG_ENV` | `production` | Which `urls` key every tile is resolved against. |
| `EVER_WORKS_PLATFORM_CATALOG_SELF_ID` | `ever-works` | The entry marked **current** — "You're here". |

An entry is dropped individually, never fatally: an unparseable or unsafe entry is logged with its id and
reason and the rest of the catalog still renders. A failed refresh serves the last good copy.

## `platforms.json`

```jsonc
{
	"schemaVersion": 1,
	"catalogVersion": "0.1.0",
	"platforms": [
		{
			"id": "ever-gauzy",              // ^[a-z0-9-]{2,40}$ — also the App Launcher preference key
			"name": "Ever Gauzy",            // ≤ 40 characters
			"description": "…",              // ≤ 80 characters
			"icon": "icons/ever-gauzy.svg",  // ^icons/[a-z0-9-]+\.(svg|png)$ · ≤ 16 KiB
			"order": 20,                     // 0..9999
			"status": "available",           // "available" | "beta"
			"urls": { "production": "…", "stage": "…", "develop": "…" }  // one https address per environment
		}
	]
}
```

At most **24** entries, and ids are unique. All three environments are **required** for every entry, so a
missing environment is a visible error here rather than a silently absent tile.

## The entries

| Order | Id | Name | Status | Description | Grounded in |
| --- | --- | --- | --- | --- | --- |
| 10 | `ever-works` | Ever Works | `available` | `TBD` | the mock marks it "You're here" (`EVER_WORKS_PLATFORM_CATALOG_SELF_ID` default `ever-works`) |
| 20 | `ever-gauzy` | Ever Gauzy | `available` | Work and time management for teams. | the catalog example in the plan |
| 30 | `ever-teams` | Ever Teams | `beta` | `TBD` | the launcher mock shows Ever Teams badged **Beta** |

These are **the first three and no others**; every additional entry is a per-entry decision with a named
owner, not a batch one.

## Placeholders — replace these

This repository is a seed, and three things in it are knowingly incomplete. All three are marked `TBD` or
`PLACEHOLDER` rather than guessed:

1. **Every address** (`urls.production`, `urls.stage`, `urls.develop`) for all three entries.
2. **The description** for `ever-works` and `ever-teams`.
3. **The icons** — `icons/*.svg` are neutral monograms, not brand marks. Each carries a `<desc>` saying so.
   Replace them with the official assets; the file names are already the ones the entries reference.

## Validating locally

```bash
npm install
npm run validate
```

The check is: the schema, unique ids, the ≤ 24-entry cap, every icon present and ≤ 16 KiB, SVG icons free of
`<script>`, `on<event>=`, `javascript:` and `<foreignObject>`, and an `https` address per environment. It
exits non-zero and names the failing entry. `TBD` addresses are warnings, not errors.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](./LICENSE).
