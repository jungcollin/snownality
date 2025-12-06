# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Snow Crystal Personality Test (눈 결정 성격 테스트) - a single-page application that matches users to one of 80 Magono-Lee snow crystal types based on a **20-question quiz using the OCEAN (Big Five) personality model**. Results include Korean personality titles, descriptions, OCEAN stat profiles, and relationship advice.

## Development Commands

- **Run locally:** Open `index.html` directly in a browser, or use `python3 -m http.server` for HTTP-based API testing
- **Run tests:** `npm test` (Playwright tests)
- **List assets:** `rg --files` to inspect available files

## Architecture

- **`index.html`** - Self-contained SPA with inline CSS and JavaScript. Uses vanilla ES modules, no build step or bundler. Integrates with Supabase for room/sharing features.
- **`magonilee.json`** - Source of truth for all 80 crystal types: codes (e.g., `N2c`, `P1e`), Korean titles, descriptions, and T/H/V/R numeric stats (converted to OCEAN internally).
- **`sample_*.html`** - SVG icon sheets for crystal types. Do not rename or restructure.
- **`tests/`** - Playwright test files for quiz flow, room features, and SVG rendering.

## Personality Model

The quiz uses the **OCEAN (Big Five)** model with 20 questions (4 per axis):
- **O** (Openness): 개방성 - 새로운 경험에 대한 태도
- **C** (Conscientiousness): 성실성 - 계획성과 책임감
- **E** (Extraversion): 외향성 - 사회적 에너지
- **A** (Agreeableness): 친화성 - 협조성과 배려
- **N** (Neuroticism): 신경성 - 감정적 안정성

## Code Style

- Keep `index.html` self-contained with inline `<style>` and `<script>` blocks
- Use 2-space indentation and descriptive variable names
- Preserve existing naming for crystal codes and T/H/V/R stat keys
- No external JavaScript frameworks

## Manual Testing Checklist

After changes, verify:
1. Quiz flow: start → 20 questions → result
2. Room view loads correctly when `?room=...` parameter is present
3. SVG icons render crisply against the dark background
4. Relationship advice modal shows MZ-style personalized tips
5. Loading spinner appears during data operations
