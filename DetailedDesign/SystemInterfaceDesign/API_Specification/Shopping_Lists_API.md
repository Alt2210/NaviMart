# RESTful API Specification - Shopping Lists

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAll
- **URL**: `/api/shopping-lists`
- **Method**: `GET`
- **Description**: Shopping lists for current family.
- **Source File**: `shopping-lists.controller.ts`

---

## 2. create
- **URL**: `/api/shopping-lists`
- **Method**: `POST`
- **Description**: Shopping list created.
- **Source File**: `shopping-lists.controller.ts`

---

## 3. findOne
- **URL**: `/api/shopping-lists/:listId`
- **Method**: `GET`
- **Description**: Shopping list detail.
- **Source File**: `shopping-lists.controller.ts`

---

## 4. update
- **URL**: `/api/shopping-lists/:listId`
- **Method**: `PATCH`
- **Description**: Shopping list updated.
- **Source File**: `shopping-lists.controller.ts`

---

## 5. remove
- **URL**: `/api/shopping-lists/:listId`
- **Method**: `DELETE`
- **Description**: Shopping list archived.
- **Source File**: `shopping-lists.controller.ts`

---

## 6. complete
- **URL**: `/api/shopping-lists/:listId/complete`
- **Method**: `POST`
- **Description**: Shopping list completed and checked items added to pantry.
- **Source File**: `shopping-lists.controller.ts`

---

## 7. addItem
- **URL**: `/api/shopping-lists/:listId/items`
- **Method**: `POST`
- **Description**: Shopping list item added.
- **Source File**: `shopping-lists.controller.ts`

---

## 8. updateItem
- **URL**: `/api/shopping-lists/:listId/items/:itemId`
- **Method**: `PATCH`
- **Description**: Shopping list item updated.
- **Source File**: `shopping-lists.controller.ts`

---

## 9. removeItem
- **URL**: `/api/shopping-lists/:listId/items/:itemId`
- **Method**: `DELETE`
- **Description**: Shopping list item removed.
- **Source File**: `shopping-lists.controller.ts`

---

