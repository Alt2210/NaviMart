# NaviMart Swagger Docs

Swagger UI is available when the backend is running:

```text
http://localhost:3000/api/docs
```

The OpenAPI JSON document is exposed by Nest Swagger at:

```text
http://localhost:3000/api/docs-json
```

## Authentication

1. Call `POST /api/auth/register` or `POST /api/auth/login`.
2. Copy the returned `accessToken`.
3. Click `Authorize` in Swagger UI.
4. Paste the token as the bearer token value.

Most endpoints require `Authorization: Bearer <accessToken>`.

## Permission Model

Business endpoints are scoped to the current user's family. Some actions require family permissions:

- `manage_family`: create invites, update member permissions, remove members.
- `edit_lists`: create/update/delete shopping lists and list items.
- `edit_pantry`: create/update/delete pantry items, consume items, mark waste.
- `edit_meals`: create/update/delete meal plans.
- `view_reports`: read family reports.

## Main Flows

### Register and create family

1. `POST /api/auth/register`
2. `POST /api/family`
3. `POST /api/family/invite` if another user needs to join.

### Complete shopping list into pantry

1. `POST /api/shopping-lists`
2. `POST /api/shopping-lists/{listId}/items`
3. `PATCH /api/shopping-lists/{listId}/items/{itemId}` with `isChecked: true`
4. `POST /api/shopping-lists/{listId}/complete`

Checked items are added to pantry and inventory events are recorded.

### Meal plan to shopping list

1. `GET /api/recipes`
2. `POST /api/meals`
3. `GET /api/meals/{mealId}/missing-ingredients`
4. `POST /api/meals/{mealId}/generate-shopping-list`

### Recipe to shopping list

1. `GET /api/recipes/{recipeId}/missing-ingredients`
2. `POST /api/recipes/{recipeId}/generate-shopping-list`

## Local Helpers

Seed sample catalog and recipes:

```bash
npm run seed
```

Run validation:

```bash
npm run build
npm test
```
