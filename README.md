# Ever Works — platform catalog

**This repository is the catalog of Ever platforms.** Ever Works reads it to render the **Ever apps** in its
App Launcher: one tile per platform, in `order`, with the address for the environment Ever Works is running
in.

**Addresses are data in this repository — none of them appear in platform code.** Ever Works fetches
`platforms.json` from the raw host and then each referenced icon, so a change here is a change to every
launcher without a deploy.

> **Status:** eight entries, in the order every Ever app lists them (Ever Platform, Works, Teams, Gauzy, Rec,
> Traduora, Demand, Tech), each with its one line and official icon. Each address is the product's **app** for
> that environment, or its production app where that environment has none (in-app switcher brief, owner
> 2026-11-26). Ever Demand is listed as `soon`: the launcher shows it with a **Soon** chip and never as a link.
> No address is `TBD`. Two hosts are still being built and do not answer yet; see **Hosts still being
> built** below.

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
| 10 | `app-ever-co` | Ever Platform | `available` | One account for every Ever app | https://app.ever.co | https://app-stage.ever.co | https://app-dev.ever.co |
| 20 | `ever-works` | Ever Works | `available` | AI agents that run your business | https://app.ever.works | https://app-stage.ever.works | https://app-dev.ever.works |
| 30 | `ever-teams` | Ever Teams | `beta` | Work and project management | https://app.ever.team | https://stage.ever.team | https://demo.ever.team |
| 40 | `ever-gauzy` | Ever Gauzy | `available` | ERP, CRM and HR in one app | https://app.gauzy.co | https://stage.gauzy.co | https://demo.gauzy.co |
| 50 | `ever-rec` | Ever Rec | `available` | Screen capture and recording | https://app.rec.so | https://app.rec.so | https://app.rec.so |
| 60 | `ever-traduora` | Ever Traduora | `available` | Translation management for teams | https://app.traduora.co | https://app.traduora.co | https://demo.traduora.co |
| 70 | `ever-demand` | Ever Demand | `soon` | Commerce and on-demand marketplaces | https://app.everdemand.co | https://app.everdemand.co | https://app.everdemand.co |
| 80 | `ever-tech` | Ever Tech | `available` | Engineers and operated agents for hire | https://app.ever.tech | https://app-stage.ever.tech | https://app-dev.ever.tech |

Each address is the product's **app** for that environment (owner, 2026-11-26: the switcher goes to the apps,
not the websites), or its production app where that environment has none. Ever Tech links to its client app
(https://app.ever.tech, live in all three environments since 2026-11-27). The lines are the same as on the
Ever websites (homelab `docs/brand/EVER-SITES-UNIFIED-CHROME.md` §4 and §4b); Ever Works translates them
into its 21 languages by id. Every additional entry is a per-entry decision with a named owner, not a batch one.

## Icons

Each icon is the product's official icon as its own site serves it (`favicon.svg`), and Ever Traduora's is the
logo of its documentation site (`icons/ever-traduora.png`, 400 × 400). Ever Works and Ever Teams currently
share one site icon, so their tiles look alike until either product publishes its own mark; the names tell
them apart.

## Hosts still being built

No address is `TBD`. Two of them do not answer yet, on purpose (owner, 2026-11-26):

1. **`ever-traduora` → https://app.traduora.co** (production and stage): Ever Traduora as SaaS, being built.
   Develop links to the live demo, https://demo.traduora.co.
2. **`ever-demand` → https://app.everdemand.co**: the Ever Demand admin as SaaS, being built. The entry stays
   `soon` (never a link) until that host answers.

To point a row somewhere else in the meantime, change only its address here: the launchers pick it up on
their next catalog read (within an hour), with no deploy.

## Validating locally

```bash
npm install
npm run validate
```

The check is: the schema, unique ids, the ≤ 24-entry cap, every icon present and ≤ 16 KiB, SVG icons free of
`<script>`, `on<event>=`, `javascript:` and `<foreignObject>`, and an `https` address per environment. It
exits non-zero and names the failing entry. A `TBD` address would be a warning, not an error.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT — see [`LICENSE`](./LICENSE).
