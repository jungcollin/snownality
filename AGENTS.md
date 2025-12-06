# Repository Guidelines

This directory hosts the Snow Crystal Personality Test assets and local configuration for the Codex CLI. Treat it as a lightweight, config‑oriented project rather than a full application repo.

## Project Structure & Module Organization

- `index.html` – Single‑file SPA for the 눈 결정 성격 테스트, including inline CSS/JS and Supabase integration.
- `sample_10.html` … `sample_80.html` – Source icon sheets; each contains SVGs and labels for Magono‑Lee snow crystal types. Do not rename or radically change their structure.
- `magonilee.json` – Metadata for all 80 crystals (codes, Korean titles, descriptions, stats). This is the source of truth for personality text and numeric T/H/V/R values.
- Other CLI files (`config.toml`, `auth.json`, logs, history) belong to Codex CLI; edit cautiously and never commit secrets or transcripts.

## Build, Test, and Development Commands

- Open `index.html` directly in a modern browser to run the test locally.
- Optionally use a simple static server, e.g. `python3 -m http.server` from this directory, if you need `http://` for APIs.
- Use `rg --files` to quickly inspect available assets and configuration files.

## Coding Style & Naming Conventions

- Keep `index.html` self‑contained: inline `<style>` and `<script>` only; no build step or bundler.
- Prefer 2‑space indentation and descriptive variable names (no single‑letter names except simple loop indices).
- JavaScript is vanilla ES modules in a single script block; avoid adding frameworks.
- Preserve existing naming for snow crystal codes (e.g. `N2c`, `P1e`) and T/H/V/R stat keys.

## Testing Guidelines

- Rely on manual testing in desktop and mobile browsers.
- After changes, verify:
  - Quiz flow (start → 12 questions → result).
  - Supabase‑backed room view (results list + 관계맵) still loads when `?room=...` is present.
  - SVG icons render crisply against the dark background.

## Commit & Pull Request Guidelines

- Use short, action‑oriented commit messages, e.g. `feat: add room compatibility map`, `fix: tweak T/H/V/R copy`.
- In PR descriptions, include:
  - What changed and why.
  - How you manually verified (browser + any commands).
  - Notes on any config or Supabase schema changes (tables/columns, new env requirements).
