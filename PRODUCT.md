# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step, hosted on GitHub Pages. Supabase for auth + progress sync (Postgres + JWT + Row Level Security). All state layered on browser localStorage as a fallback so the app is fully usable offline / logged-out.

## Users

**Primary user:** Amit — a working DevOps-adjacent engineer (Israel-based; the project author) using the site as their personal daily-learning ritual. Skill level: comfortable with several DevOps areas, deepening others. Opens the site in a **morning coffee ritual** (10–15 minutes, broadsheet mode) — one chapter with real attention, not a task-app quick check.

**Secondary user:** other engineers with similar goals who find the project on GitHub Pages / LinkedIn. They read from any device, may create their own account, sync progress.

## Product Purpose

A field-manual style daily reader on DevOps. Thirty chapters across seven parts, each with an examination; a cumulative cross-chapter exam at the end of each part; a rotating dictionary. The site succeeds when the reader **returns tomorrow** and, over months, feels genuine understanding compound. Progress and quiz results are the reader's evidence to themselves that they're moving.

Success is not shipping content or maximizing session length. It's ritual and retention.

## Positioning

- **Not a course.** No videos, no instructor, no completion certificate, no gamified habit loops.
- **Not documentation.** Not a reference to grep — chapters have voice, opinion, and a curator's hand.
- **Not a blog.** Not chronological. Not a feed. A bounded, structured object with a beginning, middle, and end.

Closest neighbor: a well-edited **field manual or almanac** — Wisden Cricketers' Almanack, The Old Farmer's Almanac, an engineering handbook — physical objects a practitioner keeps by their desk and re-opens.

## Content

- **30 chapters** across **7 parts** (Foundations · Networking & Access · Orchestration & GitOps · Infrastructure & Cloud · Data, Applications & Security · Observability · AI Interfaces). Each chapter: intro (2-3 paragraphs) + 8-13 concepts (as a glossary) + one practical code example + a 5-6 question examination.
- **75-entry rotating dictionary** — one term surfaced per day.
- **46 cross-chapter exam questions** (Part exams blend these with sampled chapter questions).
- Cross-references between chapters via `[[topic-id]]` links.

## Functionality (must remain)

- Home page with: masthead, cover, "Today's Reading" plate (auto-picks lowest-numbered incomplete chapter), progress stats, "Definition of the Day" plate, chapter grid grouped by part (foldable per part), each part ending with a cumulative-exam card.
- Chapter view: title + tag, intro, concepts glossary, code example, examination (gated behind a "Start" button).
- Exam view (part-level): 20 shuffled questions from that part with randomized option order; per-chapter breakdown at the end.
- Persistent progress in localStorage; syncs to Supabase for logged-in users.
- Light and dark themes (toggle + system preference).
- Sign in / Sign up modal (Supabase Auth email+password).

## Voice

Written from a practitioner's chair, not a teacher's lectern. Direct, opinionated, willing to name trade-offs. Occasional dry humour. No hedging, no exclamations, no "let's dive in."

## Durable constraints

- Single-file vanilla HTML/CSS/JS (no build step).
- Hosted on GitHub Pages at `https://amitkriaf.github.io/DevOps101/`.
- Supabase project already provisioned (URL and anon key committed in `config.js`).
- All content in English.
- Runs equally well without an account (localStorage-only path must stay first-class).

## Accessibility

- WCAG AA colour contrast target for both themes.
- Keyboard-operable throughout (chapter grid, quiz options, part fold, sign-in modal, exam navigation).
- Respects `prefers-reduced-motion`.
- Text over 16px base; comfortable reading measure.

## Explicit brand commitments

- **Field manual metaphor** is pinned by the user. New visual world must be able to carry it, though it need not render as a literal book or notebook.
- **Chapter and part numbering** stays (Ch. 01–30, Parts I–VII).
- **"Field Manual on the Practice of DevOps"** — masthead identity.
- No AI-generated illustration or stock photography unless intentionally editorial.

## Open decisions

- Whether custom photography / editorial imagery is introduced (currently: purely typographic + subtle rules).
- Whether the visual world stays warm-paper / editorial-craft, or shifts materially (this redesign's decision).
- User's answer to the "anti-defaults" question was empty — no specific AI-defaults were explicitly banned by the user, though the request itself ("doesn't want to look like AI wrote it") functions as a general anti-default; treat all commonly-clustered AI looks as at-risk.

<!-- IMPECCABLE-INFERRED: The above was written from established project context accumulated across the full session with the user, not from a fresh init interview. Every fact restates decisions the user made explicitly earlier in the conversation. -->
