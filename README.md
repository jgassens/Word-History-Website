# Ināt Open Apps Website

Static project, about, privacy, support, and build pages for Ināt Open Apps
(plain-text legal name: Inat Open Apps). The site presents small local-first
tools for research, teaching, document recovery, chemistry screen savers, irrigation, Home Assistant,
and citation workflows, with source links and macOS DMG builds hosted here
where available.

The site is intentionally plain: no framework, no tracking, no account system,
and no build step. It is meant to be a public shelf for practical open tools,
not a software-as-a-service storefront.

## Projects

- [Office History](https://jeremiahsrandom.website/word-history.html):
  local Microsoft Office recovery history for drafts, lectures, manuscripts,
  and research paperwork on macOS.
- [Rain Bird Scheduler](https://jeremiahsrandom.website/rainbird-scheduler.html):
  Home Assistant irrigation schedules, Cycle+Soak, and runtime adjustments
  for supported Rain Bird controllers. Currently pre-release.
- [Codex Terminal Pro](https://jeremiahsrandom.website/codex-terminal-pro.html):
  an unofficial Home Assistant add-on for running OpenAI Codex CLI inside the
  `/config` workspace.
- [After Dork](https://jeremiahsrandom.website/after-dork.html): eight
  chemistry screen savers for macOS, with a built-in updater.
- [PubMate](https://jeremiahsrandom.website/pubmate.html): PMID and DOI markers
  in Word documents to EndNote import records and temporary citations.

## Repository Metadata

GitHub-facing descriptions, topics, and homepage links for the related public
repositories are maintained to match the language on this site:

- `Word-History-Website`: static Inat Open Apps site.
- `RainBirdScheduler`: Home Assistant irrigation scheduler using the core Rain Bird integration.
- `codex-terminal-pro`: Home Assistant add-on for Codex CLI in `/config`.
- `after-dork`: chemistry screen savers inspired by 1990s classics.
- `PubMate`: Word PMID/DOI markers to EndNote handoff files.
- `FoldForge`: local-first protein modeling and AlphaFold-style handoff
  workbench.
- `MeterialImmunome`: Streamlit and SQLite claim-curation cockpit.
- `UTD-QR-code-gen`: UT Dallas-themed QR code generator.

## Cloudflare Pages

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`

This repository has no framework, package manager, build step, or external tracking scripts.

## License

MIT. See [LICENSE](LICENSE).

## Project sources

After Dork content and screenshots come from
[`jgassens/after-dork`](https://github.com/jgassens/after-dork); its download
links use the latest GitHub release. The control-panel screenshot in that
repository predates the eighth module and is captioned accordingly.
Rain Bird Scheduler content and its overview screenshot come from
[`jgassens/RainBirdScheduler`](https://github.com/jgassens/RainBirdScheduler).
Both projects are MIT licensed. Their READMEs and release availability were
checked on 2026-09-11. Rain Bird Scheduler had no published GitHub releases;
its README described hardware validation as pending.

The previous CalShot and Close Your Laptop page addresses redirect to the
replacement projects through `_redirects`. Their existing binary assets are
retained for old direct download links, but are no longer advertised here.
