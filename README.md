# The Practitioner's Field Manual to DevOps

A daily-reader style DevOps learning site — 25 chapters across 6 parts, quizzes, and a rotating dictionary. Warm-paper aesthetic, sage-green accent, works in light and dark themes. All state is local; no accounts, no tracking, no server.

Made to be read a page at a time, not consumed as a syllabus.

## Quick start

Open `index.html` in a browser — double-click it in Finder, or:

```bash
open index.html   # macOS
xdg-open index.html   # Linux
start index.html   # Windows
```

That's the whole install. Everything is static: five files loaded from the same directory. Progress, quiz scores, streak, and "seen definitions" persist in `localStorage` per browser.

## What's in it

**25 chapters, six parts:**

| Part | Chapters |
| --- | --- |
| I — The Foundations | 01 CI/CD · 02 Docker · 03 Linux · 04 Packages |
| II — Networking & Traffic | 05 DNS · 06 Nginx · 07 TLS · 08 VPN/BGP |
| III — Orchestration & GitOps | 09 Kubernetes · 10 Helm · 11 ArgoCD · 12 Service Mesh · 13 Git |
| IV — Infrastructure & Cloud | 14 Terraform · 15 Ansible · 16 Cloud · 17 RBAC/IAM |
| V — Data, Ops & Security | 18 Databases · 19 Monitoring · 20 Queues · 21 Caching · 22 Secrets · 23 WAF · 24 APIs |
| VI — AI Interfaces | 25 MCP |

Each chapter has an introduction, 8–13 core concepts, an in-practice code example, and an examination (5–6 multiple-choice questions with explanations).

**Home page** shows:
- **Today's Reading** — the lowest-numbered chapter whose examination you haven't completed. Finish its quiz to move on to the next.
- **Progress** — how many chapters you've opened, how many you've mastered, and a daily streak.
- **Definition of the Day** — one term from a curated ~75-entry dictionary, rotated by date.
- **The Chapters** — the full grid, grouped by part.

## Project structure

```
learning_devops/
├── index.html          # 91-line shell — <link>s and <script>s only
├── manual.css          # all styles
├── manual.js           # rendering, state, quiz logic, theme, home button
├── topics.js           # PARTS array + TOPICS array (all 25 chapters)
├── definitions.js      # DEFS array (dictionary)
└── README.md           # this file
```

Load order (from `index.html`):

```html
<script src="topics.js"></script>      <!-- defines PARTS, TOPICS -->
<script src="definitions.js"></script> <!-- defines DEFS -->
<script src="manual.js"></script>      <!-- uses all of the above -->
```

## Editing content

### Add a chapter

Edit `topics.js`. Append an entry to the `TOPICS` array:

```js
{
  id: 'my-topic',
  part: 2,            // index into PARTS (0 = Foundations, ..., 5 = AI Interfaces)
  num: '26',          // chapter number as a two-char string
  title: 'My Topic',
  tag: 'One-line subtitle shown on the card and topic page.',
  intro: `First paragraph...
Second paragraph...`,
  concepts: [
    ['Term', 'Description with <code>inline code</code> and cross-links like [[docker]].'],
    // ...
  ],
  code: `<span class="c"># commented code</span>
$ some command
<span class="k">keyword</span> value`,
  codeCap: 'One-line caption below the code block.',
  quiz: [
    {
      q: 'Question?',
      options: ['a', 'b', 'c', 'd'],
      correct: 2,     // 0-indexed
      why: 'Short explanation shown after answering.',
    },
    // ...
  ],
},
```

Code-block spans (kept lightweight so we don't need a real syntax highlighter):

- `<span class="k">…</span>` — keyword
- `<span class="s">…</span>` — string
- `<span class="c">…</span>` — comment
- `<span class="n">…</span>` — number / literal

### Add a definition

Edit `definitions.js`. Append to the `DEFS` array — `[term, body]`:

```js
['MyTerm', 'A one-line definition, may include <code>markup</code>.'],
```

The Definition of the Day rotates through the array by day-of-year, so a new entry appears in rotation automatically.

### Adjust colors, fonts, spacing

Everything is CSS tokens at the top of `manual.css`. The `:root` block defines the light palette; `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]` redefine tokens for dark. Change a token in all three (or use the manual theme toggle) and both themes stay coherent.

## Storage

State is kept in `localStorage` under these keys:

| Key | Contents |
| --- | --- |
| `devops_manual_progress_v1` | Per-chapter progress: visited, quiz answers, complete flag |
| `devops_manual_defs_seen_v1` | Array of DEFS indices already surfaced |
| `devops_manual_visits` | ISO dates of home-page visits (used for streak) |
| `devops_manual_theme` | `light` / `dark` if the user has toggled explicitly |

To reset progress: `localStorage.clear()` in the browser console.

## Publishing on GitHub Pages

```bash
cd learning_devops
git init
git add .
git commit -m "field manual v1"
gh repo create devops-manual --public --push --source=.
```

Then in the GitHub UI: **Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root) → Save**. First deploy takes a minute; the URL will be something like `https://<user>.github.io/devops-manual/`.

Updates: push to `main`, GitHub Pages rebuilds automatically.

## Design notes

- **Typography** — Iowan Old Style / Palatino for display, Charter for body, JetBrains Mono for code. Deliberately not the usual Inter/Space Grotesk defaults, to lean into the "field manual" character.
- **Palette** — warm paper foundation, deep sage-green primary accent, warm terracotta secondary. Both themes use the same tokens through CSS custom properties.
- **Numbering** — chapters use plain `01`–`25`; parts use Roman numerals I–VI. Both are strings, sorted lexicographically within a part.

## Acknowledgements

Content curated for a practitioner learning modern DevOps in 2026. All chapter content is written to be technically accurate but is not a substitute for the vendor documentation of any tool it mentions.
