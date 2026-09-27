---
name: reference-review-environment
description: Quirks of reviewing bai-tap-lop-2 on this machine - node_modules blocked in Bash, how to probe lesson-core, e2e port
metadata:
  type: reference
---

- A scout-block hook blocks any Bash command whose text contains `node_modules`; the Grep tool can still search `apps/*/node_modules/...` (for example to check library source such as workers-oauth-provider).
- To run lesson-core quickly: copy a .ts probe into `apps/editor/` and run `pnpm exec tsx probe.ts` (the editor has tsx and resolves the `lesson-core` workspace import). Delete the probe afterwards.
- `pnpm ci:all` takes about 1 minute; the editor tests use a temporary git repo in %TEMP% and leave the working tree clean.
- Playwright e2e uses port 4331 (`pnpm --filter site test:e2e`, about 10 seconds). Leftover TIME_WAIT entries on that port are harmless; only LISTENING means the port is busy.
- Review report from 2026-09-27: plans/reports/code-reviewer-260927-2131-toan-bo-repo.md. Main themes were unsanitized markdown link schemes, lost updates between the editor and MCP writers, and N+1 calls in list_lessons. See [[project-two-writers-conflict]].
