# RESTful API Specification - Auth

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: User account created.
- **Source File**: `auth.controller.ts`

---

## 2. login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: User authenticated.
- **Source File**: `auth.controller.ts`

---

## 3. refresh
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Description**: Access and refresh tokens rotated.
- **Source File**: `auth.controller.ts`

---

## 4. logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: Refresh token revoked.
- **Source File**: `auth.controller.ts`

---

## 5. forgotPassword
- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Description**: Password reset requested.
- **Source File**: `auth.controller.ts`

---

## 6. resetPassword
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Description**: Password reset and refresh tokens revoked.
- **Source File**: `auth.controller.ts`

---

## 7. sendVerification
- **URL**: `/api/auth/send-verification`
- **Method**: `POST`
- **Description**: Email verification requested.
- **Source File**: `auth.controller.ts`

---

## 8. verifyEmail
- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Description**: Email verified.
- **Source File**: `auth.controller.ts`

---

