# Repository Agent Rules: bai-tap-lop-2

Process rules steering agent behavior. For system design and architecture rationale, see [docs/index.md](file:///Users/hoandat/inet-gitlab/bai-tap-lop-2/docs/index.md).

## Mandatory Tooling & Environment

- Package manager: `pnpm` only (v10+). Never run `npm` or `yarn`.
- Runtime: Node `>=22` (enforced via `.nvmrc` and `package.json`).
- Monorepo workspace: `packages/lesson-core`, `apps/site`, `apps/editor`, `apps/mcp-worker`.

## Primary Verification Commands

- Full gate (must run before finishing any change): `pnpm ci:all` (lint + typecheck + test + build).
- Fast unit test run: `pnpm test`
- Package-scoped test: `pnpm --filter <site|editor|mcp-worker|lesson-core> test`
- Single test file: `pnpm --filter site exec vitest run tests/unit/game/game-state.test.ts`
- E2E tests: `pnpm --filter site test:e2e` (uses local Chrome channel; ensure port 4331 is clear).
- Code formatting & linting: `pnpm lint` and `pnpm format`.

## Hard Invariants & Guardrails

1. **No AI Image Generation**:
   - Never call external image generation APIs (Gemini, DALL-E, etc.). Free quota is restricted and styles diverge.
   - All art assets MUST be code-rendered SVG or curated CC0/CC BY-SA packs ([Kenney](https://kenney.nl/assets), [OpenMoji](https://openmoji.org/)).
   - Every file placed in `apps/site/public/game/` must be registered in `apps/site/public/game/licenses.json`.

2. **No Copyrighted Educational Materials**:
   - Never copy exercises, questions, or reading passages verbatim from SGK (textbooks) or competition booklets (FERMAT, TIMO).
   - All questions must be procedurally generated via code generators or originally authored.
   - Web is publicly hosted at `lop2.hoandat.com`.

3. **Child Privacy & Safety**:
   - Public deployment: Only use child's home nickname (`Miu`), sibling (`Bo`), and day/month of birth.
   - NEVER commit or expose child's full legal name, birth year, school name, or residential location (see `packages/lesson-core/src/child-profile.ts`).

4. **Event System Boundary**:
   - Events (e.g. TIMO) are transient plug-in modules to a World.
   - Events MUST NEVER define their own isolated skill catalog; they must reference existing skills in `apps/site/src/lib/game/skills/skill-registry.ts`.
   - Adding or removing an event must not alter or break Base curriculum code.

5. **Multi-World Boundary**:
   - Each grade year is a self-contained World (`lop-2`, `lop-3`).
   - Grade skill IDs use grade prefix (`lop-2/chan-le`).
   - Adding or updating a new grade world must not touch or regress existing grade worlds.

6. **Pedagogy & Interaction Standard**:
   - Interactive gameplay mechanics only (drag-and-drop, tap, connect, rotate, steer).
   - NEVER create multiple-choice (A/B/C/D) worksheets for Base curriculum.
   - Active learning actions must occupy >= 70% of task time. Animations must be <= 1.5s and skippable.
   - Primary target device: iPad Safari (touch-first, no hover dependencies, 50+ fps animations, full PWA offline operation).

7. **Markdown & XSS Security**:
   - Markdown renderer and validator must strictly sanitize links (only allow `https:` schemes, reject `javascript:` or raw inline HTML).

8. **State Management**:
   - Game state lives in `localStorage` under key `the-gioi:v1`.
   - Always ensure schema changes in `apps/site/src/lib/game/state/game-state.ts` are backward-compatible using Zod `.default()`.

## Definition of Done (DoD)

Before declaring any implementation or fix complete:

1. `pnpm ci:all` passes with exit code 0.
2. New skill generators have automated tests verifying correct answers over >= 200 seeds across all 5 tiers.
3. No secrets or personal data introduced in git working tree.
4. Relevant documentation in `docs/` updated if system contracts changed.
