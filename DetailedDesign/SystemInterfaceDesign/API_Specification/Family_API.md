# RESTful API Specification - Family

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. getCurrentFamily
- **URL**: `/api/family`
- **Method**: `GET`
- **Description**: Current active family.
- **Source File**: `families.controller.ts`

---

## 2. create
- **URL**: `/api/family`
- **Method**: `POST`
- **Description**: Family created.
- **Source File**: `families.controller.ts`

---

## 3. createInvite
- **URL**: `/api/family/invite`
- **Method**: `POST`
- **Description**: Invite code created.
- **Source File**: `families.controller.ts`

---

## 4. join
- **URL**: `/api/family/join`
- **Method**: `POST`
- **Description**: Joined family.
- **Source File**: `families.controller.ts`

---

## 5. updateMemberPermissions
- **URL**: `/api/family/members/:memberId/permissions`
- **Method**: `PATCH`
- **Description**: Family member permissions updated.
- **Source File**: `families.controller.ts`

---

## 6. removeMember
- **URL**: `/api/family/members/:memberId`
- **Method**: `DELETE`
- **Description**: Family member removed.
- **Source File**: `families.controller.ts`

---

