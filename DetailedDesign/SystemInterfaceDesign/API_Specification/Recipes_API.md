# RESTful API Specification - Recipes

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAll
- **URL**: `/api/recipes`
- **Method**: `GET`
- **Description**: Recipe search results.
- **Source File**: `recipes.controller.ts`

---

## 2. getSuggestions
- **URL**: `/api/recipes/suggestions`
- **Method**: `GET`
- **Description**: Recipe suggestions ranked by pantry ingredient match.
- **Source File**: `recipes.controller.ts`

---

## 3. findFavorites
- **URL**: `/api/recipes/favorites`
- **Method**: `GET`
- **Description**: Current user favorite recipes.
- **Source File**: `recipes.controller.ts`

---

## 4. findOne
- **URL**: `/api/recipes/:recipeId`
- **Method**: `GET`
- **Description**: Recipe detail.
- **Source File**: `recipes.controller.ts`

---

## 5. addFavorite
- **URL**: `/api/recipes/:recipeId/favorite`
- **Method**: `POST`
- **Description**: Recipe added to favorites.
- **Source File**: `recipes.controller.ts`

---

## 6. removeFavorite
- **URL**: `/api/recipes/:recipeId/favorite`
- **Method**: `DELETE`
- **Description**: Recipe removed from favorites.
- **Source File**: `recipes.controller.ts`

---

## 7. getMissingIngredients
- **URL**: `/api/recipes/:recipeId/missing-ingredients`
- **Method**: `GET`
- **Description**: Missing ingredients compared with pantry.
- **Source File**: `recipes.controller.ts`

---

## 8. generateShoppingList
- **URL**: `/api/recipes/:recipeId/generate-shopping-list`
- **Method**: `POST`
- **Description**: Shopping list generated from missing recipe ingredients.
- **Source File**: `recipes.controller.ts`

---

## 9. create
- **URL**: `/api/recipes`
- **Method**: `POST`
- **Description**: Recipe created.
- **Source File**: `recipes.controller.ts`

---

## 10. update
- **URL**: `/api/recipes/:recipeId`
- **Method**: `PATCH`
- **Description**: Recipe updated.
- **Source File**: `recipes.controller.ts`

---

## 11. remove
- **URL**: `/api/recipes/:recipeId`
- **Method**: `DELETE`
- **Description**: Recipe archived.
- **Source File**: `recipes.controller.ts`

---

