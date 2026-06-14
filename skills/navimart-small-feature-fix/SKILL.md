---
name: navimart-small-feature-fix
description: Use this skill for small NaviMart feature fixes that may touch a frontend screen, an existing API helper/type, and a narrow backend NestJS DTO/schema/service contract. Trigger on requests like fixing a broken button or upload, changing a screen label with behavior, wiring an existing endpoint into a page, preserving a newly collected field through API persistence, or reviewing a just-completed small fix to turn it into repeatable guidance. Do not use for broad redesigns, unrelated refactors, new modules, database rewrites, or speculative architecture work.
---

# NaviMart Small Feature Fix

## Goal

Make the smallest working change that completes a user-visible NaviMart feature without spreading edits across unrelated modules. Prefer existing patterns in this repo over new abstractions or dependencies.

## When To Apply

Use this skill when the request is scoped to one user flow, for example:

- A page control is visible but does not do anything.
- A text change also requires behavior to match the new label.
- A frontend form needs to call an existing API helper.
- A submitted field needs to persist through backend DTO, schema, service response, and frontend types.
- A small feature fix should be reviewed and generalized for future agents.

Do not use it for full feature design, visual redesigns, auth model changes, migrations, large test-suite rewrites, or multi-module product changes.

## Files To Check First

Start with only files directly related to the request:

- Root guidance: `AGENTS.md`.
- Route ownership: `frontend/src/App.tsx`.
- Target page: `frontend/src/pages/<PageName>.tsx`.
- Shared UI used by the page: `frontend/src/components/`.
- API helpers and types: `frontend/src/api/index.ts`, `frontend/src/api/types.ts`, `frontend/src/api/client.ts`.
- Existing similar implementation: search `frontend/src/pages/` for the same action, label, state, endpoint, or helper name.

Only inspect backend when data must be saved, validated, or returned:

- Controller/service module: `backend/src/<feature>/`.
- DTOs: `backend/src/<feature>/dto/`.
- Mongoose schema: `backend/src/<feature>/schemas/`.
- Response mapping functions, usually in `*.service.ts`.
- Existing tests beside source as `*.spec.ts` or in `backend/test/*.e2e-spec.ts`.

## Workflow

1. Read `AGENTS.md` and follow its repo-specific instructions, especially minimal changes and Vietnamese responses.
2. Locate the route/page and search for the exact label, icon, handler, API helper, and related state.
3. Look for an existing working pattern before inventing one. For uploads, compare pages such as profile or recipe editor before editing the target page.
4. Decide whether the change is UI-only or must persist data.
5. For UI-only fixes, edit the target page/component only.
6. For persisted fields, update the narrow contract end to end:
   - frontend page state and submit payload,
   - `frontend/src/api/index.ts` input type,
   - `frontend/src/api/types.ts` response type,
   - backend create/update DTO validation,
   - backend schema property,
   - backend service create/update and response mapping.
7. Preserve current API response shape except for the specifically required field.
8. Keep loading, disabled, success, and error states consistent with nearby code.
9. Run minimal tests and builds for touched apps.
10. Report only what changed, files changed, and how to test.

## Guardrails

- Do not rename files, routes, DTOs, schemas, APIs, or components unless the request explicitly requires it.
- Do not refactor unrelated code while fixing the feature.
- Do not add dependencies for behavior that an existing helper already supports.
- Do not edit `.env` files or commit secrets.
- Do not change UI design beyond the requested control, label, state, or preview.
- Do not touch backend modules if the fix can be completed in the frontend.
- Do not broaden validation rules or response formats outside the specific field or behavior.
- If more than three files are needed, explain why before continuing.
- Preserve unrelated dirty worktree changes; never revert files you did not modify.

## Minimal Testing

Run checks for every app touched:

```powershell
cd frontend; npm run build
cd backend; npm run build
```

If frontend behavior changed, also run:

```powershell
cd frontend; npm test
```

If backend DTO/schema/service behavior changed, also run:

```powershell
cd backend; npm test
```

For persistence or cross-module flows, prefer the narrowest relevant e2e command:

```powershell
cd backend; npm run test:e2e
```

If a command cannot run because a local binary or dependency is missing, state the exact failure and keep any successful build/test results separate.

## Final Response Shape

Respond in Vietnamese. Keep the final concise:

- `What changed`: behavior-level summary.
- `Files changed`: exact paths.
- `How to test`: commands run and any command that failed with reason.

Mention any pre-existing modified files that were left untouched.
