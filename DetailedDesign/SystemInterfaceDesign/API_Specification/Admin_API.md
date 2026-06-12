# RESTful API Specification - Admin

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAllCategories
- **URL**: `/api/admin/catalog/categories`
- **Method**: `GET`
- **Description**: Catalog categories.
- **Source File**: `admin-catalog.controller.ts`

---

## 2. createCategory
- **URL**: `/api/admin/catalog/categories`
- **Method**: `POST`
- **Description**: Category created.
- **Source File**: `admin-catalog.controller.ts`

---

## 3. updateCategory
- **URL**: `/api/admin/catalog/categories/:categoryId`
- **Method**: `PATCH`
- **Description**: Category updated.
- **Source File**: `admin-catalog.controller.ts`

---

## 4. removeCategory
- **URL**: `/api/admin/catalog/categories/:categoryId`
- **Method**: `DELETE`
- **Description**: Category archived.
- **Source File**: `admin-catalog.controller.ts`

---

## 5. findAllFoods
- **URL**: `/api/admin/catalog/foods`
- **Method**: `GET`
- **Description**: Catalog foods.
- **Source File**: `admin-catalog.controller.ts`

---

## 6. createFood
- **URL**: `/api/admin/catalog/foods`
- **Method**: `POST`
- **Description**: Food created.
- **Source File**: `admin-catalog.controller.ts`

---

## 7. updateFood
- **URL**: `/api/admin/catalog/foods/:foodId`
- **Method**: `PATCH`
- **Description**: Food updated.
- **Source File**: `admin-catalog.controller.ts`

---

## 8. removeFood
- **URL**: `/api/admin/catalog/foods/:foodId`
- **Method**: `DELETE`
- **Description**: Food archived.
- **Source File**: `admin-catalog.controller.ts`

---

## 9. findAllUnits
- **URL**: `/api/admin/catalog/units`
- **Method**: `GET`
- **Description**: Catalog units.
- **Source File**: `admin-catalog.controller.ts`

---

## 10. createUnit
- **URL**: `/api/admin/catalog/units`
- **Method**: `POST`
- **Description**: Unit created.
- **Source File**: `admin-catalog.controller.ts`

---

## 11. updateUnit
- **URL**: `/api/admin/catalog/units/:unitId`
- **Method**: `PATCH`
- **Description**: Unit updated.
- **Source File**: `admin-catalog.controller.ts`

---

## 12. removeUnit
- **URL**: `/api/admin/catalog/units/:unitId`
- **Method**: `DELETE`
- **Description**: Unit archived.
- **Source File**: `admin-catalog.controller.ts`

---

## 13. findAll
- **URL**: `/api/admin/recipes`
- **Method**: `GET`
- **Description**: Paginated recipe moderation list.
- **Source File**: `admin-recipes.controller.ts`

---

## 14. updateStatus
- **URL**: `/api/admin/recipes/:recipeId/status`
- **Method**: `PATCH`
- **Description**: Recipe moderation status updated.
- **Source File**: `admin-recipes.controller.ts`

---

## 15. getStats
- **URL**: `/api/admin/stats`
- **Method**: `GET`
- **Description**: System-wide statistics.
- **Source File**: `admin-stats.controller.ts`

---

## 16. findAll
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Description**: Paginated user list.
- **Source File**: `admin-users.controller.ts`

---

## 17. findOne
- **URL**: `/api/admin/users/:userId`
- **Method**: `GET`
- **Description**: User detail.
- **Source File**: `admin-users.controller.ts`

---

## 18. create
- **URL**: `/api/admin/users`
- **Method**: `POST`
- **Description**: User created.
- **Source File**: `admin-users.controller.ts`

---

## 19. update
- **URL**: `/api/admin/users/:userId`
- **Method**: `PATCH`
- **Description**: User updated.
- **Source File**: `admin-users.controller.ts`

---

## 20. remove
- **URL**: `/api/admin/users/:userId`
- **Method**: `DELETE`
- **Description**: User deactivated (soft delete).
- **Source File**: `admin-users.controller.ts`

---

