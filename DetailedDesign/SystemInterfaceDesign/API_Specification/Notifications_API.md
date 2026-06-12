# RESTful API Specification - Notifications

Tài liệu mô tả chi tiết các endpoints được tự động đồng bộ từ mã nguồn backend.

## 1. findAll
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Description**: Current user notifications.
- **Source File**: `notifications.controller.ts`

---

## 2. markAsRead
- **URL**: `/api/notifications/:notificationId/read`
- **Method**: `PATCH`
- **Description**: Notification marked as read.
- **Source File**: `notifications.controller.ts`

---

## 3. markAllAsRead
- **URL**: `/api/notifications/read-all`
- **Method**: `PATCH`
- **Description**: All unread notifications marked as read.
- **Source File**: `notifications.controller.ts`

---

