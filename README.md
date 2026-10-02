# Ever Works — platform catalog

**This repository is the catalog of Ever platforms.** Ever Works reads it to render the **Ever apps** in its
App Launcher: one tile per platform, in `order`, with the address for the environment Ever Works is running
in.

**Addresses are data in this repository — none of them appear in platform code.** Ever Works fetches
`platforms.json` from the raw host and then each referenced icon, so a change here is a change to every
launcher without a deploy.

> **Status:** seven entries, each with its product's real public address and official icon. Ever Demand is
> listed as `soon`: the launcher shows it with a **Soon** chip and never as a link. One address is still `TBD`
> (Ever Traduora has no public develop environment yet); the validator reports it as a warning, never as an
> error, and the launcher simply does not show that entry in develop. See **Placeholders** below.

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
			"status": "available",           // "available" | "beta" | "soon"
			"urls": { "production": "…", "stage": "…", "develop": "…" }  // one https address per environment
		}
	]
}
```

At most **24** entries, and ids are unique. All three environments are **required** for every entry, so a
missing environment is a visible error here rather than a silently absent tile.

`status` is one of:

| Status | The App Launcher shows |
| --- | --- |
| `available` | the tile, linking to the address for its environment |
| `beta` | the tile with a **Beta** chip, linking to the address for its environment |
| `soon` | the tile with a **Soon** chip; it is never a link and cannot be opened |

## The entries

| Order | Id | Name | Status | Description | Production | Stage | Develop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 10 | `ever-works` | Ever Works | `available` | Build, run and evolve apps with agents. | https://app.ever.works | https://app-stage.ever.works | https://app-dev.ever.works |
| 20 | `ever-gauzy` | Ever Gauzy | `available` | Work and time management for teams. | https://app.gauzy.co | https://stage.gauzy.co | https://demo.gauzy.co |
| 30 | `ever-teams` | Ever Teams | `beta` | Plan, track and ship together. | https://app.ever.team | https://stage.ever.team | https://demo.ever.team |
| 40 | `ever-rec` | Ever Rec | `available` | Screen capture, recording and sharing. | https://rec.so | https://website-stage.rec.so | https://website-dev.rec.so |
| 50 | `ever-traduora` | Ever Traduora | `available` | Translation management for teams. | https://traduora.co | https://website-stage.traduora.co | `TBD` |
| 60 | `ever-demand` | Ever Demand | `soon` | Open platform for on-demand and sharing economies. | https://everdemand.co | https://website-stage.everdemand.co | https://website-dev.everdemand.co |
| 70 | `app-ever-co` | Ever Platform | `available` | Your Ever account, organizations and security settings. | https://app.ever.co | https://app-stage.ever.co | https://app-dev.ever.co |

Each address is the product's current public address for that environment: the web app where a product has
one, otherwise its website. Every additional entry is a per-entry decision with a named owner, not a batch
one.

## Icons

Each icon is the product's official icon as its own site serves it (`favicon.svg`), and Ever Traduora's is the
logo of its documentation site (`icons/ever-traduora.png`, 400 × 400). Ever Works and Ever Teams currently
share one site icon, so their tiles look alike until either product publishes its own mark; the names tell
them apart.

## Placeholders — replace these

One value is knowingly incomplete and marked `TBD` rather than guessed:

1. **`ever-traduora` → `urls.develop`**: Ever Traduora has no public develop environment yet. Until it has one,
   the launcher does not show Ever Traduora in develop.

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
