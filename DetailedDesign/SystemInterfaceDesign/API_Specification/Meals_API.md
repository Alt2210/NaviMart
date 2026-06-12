# RESTful API Specification - Meals

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAll
- **URL**: `/api/meals`
- **Method**: `GET`
- **Description**: Meal plans in date range.
- **Source File**: `meals.controller.ts`

---

## 2. create
- **URL**: `/api/meals`
- **Method**: `POST`
- **Description**: Meal plan created.
- **Source File**: `meals.controller.ts`

---

## 3. findOne
- **URL**: `/api/meals/:mealId`
- **Method**: `GET`
- **Description**: Meal plan detail.
- **Source File**: `meals.controller.ts`

---

## 4. getMissingIngredients
- **URL**: `/api/meals/:mealId/missing-ingredients`
- **Method**: `GET`
- **Description**: Missing ingredients for meal recipe.
- **Source File**: `meals.controller.ts`

---

## 5. generateShoppingList
- **URL**: `/api/meals/:mealId/generate-shopping-list`
- **Method**: `POST`
- **Description**: Shopping list generated from missing meal ingredients.
- **Source File**: `meals.controller.ts`

---

## 6. update
- **URL**: `/api/meals/:mealId`
- **Method**: `PATCH`
- **Description**: Meal plan updated.
- **Source File**: `meals.controller.ts`

---

## 7. remove
- **URL**: `/api/meals/:mealId`
- **Method**: `DELETE`
- **Description**: Meal plan deleted.
- **Source File**: `meals.controller.ts`

---

