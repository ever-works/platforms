#!/usr/bin/env node
/**
 * Validates the Ever platform catalog.
 *
 * WHAT IT CHECKS
 * --------------
 * Layer 1 — `platforms.json` against `schema/platforms.schema.json` with `ajv` 8 (draft 2020-12):
 * the entry count (1..24), each id's shape, `name` ≤ 40, `description` ≤ 80, `order` 0..9999, the
 * `status` enum, the icon path shape and an `https` address per environment.
 *
 * Layer 2 — the rules the JSON Schema cannot express:
 *   1. unique `id`s across `platforms[]`;
 *   2. every referenced icon exists, is a regular file, and is ≤ 16,384 bytes;
 *   3. SVG icons carry no `<script`, no `on<event>=`, no `javascript:` and no `<foreignObject>`
 *      (defence in depth — `<img>` rendering already prevents execution);
 *   4. an address that is still the placeholder `TBD` is reported as a WARNING, never as an error:
 *      it marks an owner-supplied address that has not been provided yet, and inventing one would be
 *      worse than saying so.
 *
 * USAGE
 * -----
 *   npm install
 *   node tools/validate-platforms.mjs             # exit 0 iff there are no errors
 *   node tools/validate-platforms.mjs --quiet     # print only problems and the summary
 *
 * Exit code is 1 when anything fails, and every failing entry is named.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020Module from 'ajv/dist/2020.js';

const Ajv2020 = Ajv2020Module.Ajv2020 ?? Ajv2020Module.default ?? Ajv2020Module;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const QUIET = process.argv.includes('--quiet');

const ICON_MAX_BYTES = 16_384;
const SVG_FORBIDDEN = [
	['<script', /<script/i],
	['on<event>=', /\son[a-z]+\s*=/i],
	['javascript:', /javascript:/i],
	['<foreignObject', /<foreignObject/i],
];

const errors = [];
const warnings = [];
const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

/* ── Layer 1: the schema ────────────────────────────────────────────────────────────────────────── */

const schemaPath = path.join(ROOT, 'schema', 'platforms.schema.json');
const indexPath = path.join(ROOT, 'platforms.json');

if (!fs.existsSync(schemaPath)) {
	error(`schema not found: schema/platforms.schema.json`);
}
if (!fs.existsSync(indexPath)) {
	error(`index not found: platforms.json`);
}

let catalog = null;
if (!errors.length) {
	catalog = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
	const ajv = new Ajv2020({ strict: false, allErrors: true, allowUnionTypes: true });
	const validate = ajv.compile(JSON.parse(fs.readFileSync(schemaPath, 'utf8')));
	if (!validate(catalog)) {
		for (const failure of validate.errors ?? []) {
			error(
				`platforms.json${failure.instancePath || '/'} ${failure.message}` +
					(failure.keyword === 'additionalProperties' ? ` ("${failure.params.additionalProperty}")` : ''),
			);
		}
	}
}

/* ── Layer 2: the rules the schema cannot express ───────────────────────────────────────────────── */

const platforms = Array.isArray(catalog?.platforms) ? catalog.platforms : [];

const seenIds = new Set();
for (const platform of platforms) {
	const id = platform?.id ?? '(no id)';
	if (typeof platform?.id === 'string') {
		if (seenIds.has(platform.id)) error(`platforms[].id "${platform.id}" is duplicated`);
		seenIds.add(platform.id);
	}

	if (typeof platform?.icon === 'string') {
		const iconPath = path.join(ROOT, platform.icon);
		if (!fs.existsSync(iconPath)) {
			error(`${id}: icon "${platform.icon}" does not exist`);
		} else {
			const stats = fs.statSync(iconPath);
			if (!stats.isFile()) {
				error(`${id}: icon "${platform.icon}" is not a regular file`);
			} else if (stats.size > ICON_MAX_BYTES) {
				error(`${id}: icon "${platform.icon}" is ${stats.size} bytes, over the ${ICON_MAX_BYTES}-byte cap`);
			}
			if (platform.icon.endsWith('.svg')) {
				const text = fs.readFileSync(iconPath, 'utf8');
				for (const [label, pattern] of SVG_FORBIDDEN) {
					if (pattern.test(text)) error(`${id}: icon "${platform.icon}" contains ${label}`);
				}
			}
		}
	}

	for (const [environment, address] of Object.entries(platform?.urls ?? {})) {
		if (address === 'TBD') {
			warn(`${id}: urls.${environment} is still TBD — an owner-supplied address that has not been provided yet`);
		}
	}
}

/* ── Report ─────────────────────────────────────────────────────────────────────────────────────── */

const out = [];
const line = (text = '') => out.push(text);

line('Ever Works — platform catalog validation');
line(`repository  : ${ROOT}`);
line(`ajv options : { strict: false, allErrors: true, allowUnionTypes: true }`);
line(`entries     : ${platforms.length} of at most 24`);
line();

if (!QUIET) {
	for (const platform of platforms) {
		line(`  ${String(platform.order).padStart(4)}  ${String(platform.id).padEnd(14)} ${platform.status.padEnd(10)} ${platform.icon}`);
	}
	line();
}

for (const message of warnings) line(`WARN  ${message}`);
if (warnings.length) line();
for (const message of errors) line(`ERROR ${message}`);
if (errors.length) line();

line(`${platforms.length} entries · ${warnings.length} warning(s) · ${errors.length} error(s)`);

process.stdout.write(`${out.join('\n')}\n`);

if (errors.length) {
	process.exitCode = 1;
}
