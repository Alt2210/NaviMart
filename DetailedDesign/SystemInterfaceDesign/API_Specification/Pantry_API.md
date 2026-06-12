# RESTful API Specification - Pantry

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAll
- **URL**: `/api/pantry`
- **Method**: `GET`
- **Description**: Pantry items for current family.
- **Source File**: `pantry.controller.ts`

---

## 2. create
- **URL**: `/api/pantry`
- **Method**: `POST`
- **Description**: Pantry item created.
- **Source File**: `pantry.controller.ts`

---

## 3. findOne
- **URL**: `/api/pantry/:itemId`
- **Method**: `GET`
- **Description**: Pantry item detail.
- **Source File**: `pantry.controller.ts`

---

## 4. update
- **URL**: `/api/pantry/:itemId`
- **Method**: `PATCH`
- **Description**: Pantry item updated.
- **Source File**: `pantry.controller.ts`

---

## 5. remove
- **URL**: `/api/pantry/:itemId`
- **Method**: `DELETE`
- **Description**: Pantry item deleted.
- **Source File**: `pantry.controller.ts`

---

## 6. consume
- **URL**: `/api/pantry/:itemId/consume`
- **Method**: `POST`
- **Description**: Pantry item quantity consumed.
- **Source File**: `pantry.controller.ts`

---

## 7. markWasted
- **URL**: `/api/pantry/:itemId/waste`
- **Method**: `POST`
- **Description**: Pantry item marked as wasted.
- **Source File**: `pantry.controller.ts`

---

