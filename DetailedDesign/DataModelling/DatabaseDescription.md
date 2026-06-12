# Đặc tả Cơ sở dữ liệu (Database Design & Description) - NaviMart

Tài liệu này mô tả chi tiết cấu trúc các bảng vật lý (Physical Tables) trong cơ sở dữ liệu của hệ thống NaviMart được đồng bộ trực tiếp từ thiết kế backend.

## 1. Bảng `users`
**Mô tả:** Lưu trữ thông tin tài khoản người dùng và trạng thái hoạt động.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `user_id` | INT | PK | AUTO_INCREMENT | Mã định danh duy nhất của người dùng |
| `email` | VARCHAR(150) | - | NOT NULL, UNIQUE | Email đăng nhập hệ thống |
| `phone` | VARCHAR(20) | - | NULL | Số điện thoại liên hệ |
| `password_hash` | VARCHAR(255) | - | NOT NULL | Mật khẩu đã được mã hóa |
| `first_name` | VARCHAR(50) | - | NOT NULL | Tên người dùng |
| `last_name` | VARCHAR(50) | - | NOT NULL | Họ người dùng |
| `dob` | DATE | - | NOT NULL | Ngày tháng năm sinh |
| `gender` | VARCHAR(10) | - | NOT NULL | Giới tính (Nam, Nữ, Khác) |
| `role` | VARCHAR(20) | - | NOT NULL | Vai trò (Admin, Housewife, Member) |
| `group_id` | INT | FK | NULL | Tham chiếu tới family_groups.group_id |
| `status` | VARCHAR(20) | - | NOT NULL | Trạng thái (Active, Banned) |

---

## 2. Bảng `family_groups`
**Mô tả:** Lưu trữ thông tin nhóm gia đình để dùng chung không gian lưu trữ và mua sắm.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `group_id` | INT | PK | AUTO_INCREMENT | Mã định danh duy nhất của nhóm |
| `group_name` | VARCHAR(100) | - | NOT NULL | Tên nhóm gia đình |
| `owner_id` | INT | FK | NOT NULL | Tham chiếu tới users.user_id (Người nội trợ tạo nhóm) |
| `invite_code` | VARCHAR(50) | - | UNIQUE, NULL | Mã/Link mời tham gia nhóm |

---

## 3. Bảng `categories`
**Mô tả:** Phân loại nhóm thực phẩm (do Admin quản lý).

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `category_id` | INT | PK | AUTO_INCREMENT | Mã định danh nhóm thực phẩm |
| `name` | VARCHAR(100) | - | NOT NULL | Tên nhóm (Ví dụ: Rau củ, Thịt cá) |

---

## 4. Bảng `food_catalog`
**Mô tả:** Từ điển thực phẩm chuẩn của hệ thống giúp gợi ý và tránh rác dữ liệu (do Admin quản lý).

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `food_id` | INT | PK | AUTO_INCREMENT | Mã định danh thực phẩm |
| `name` | VARCHAR(150) | - | NOT NULL | Tên thực phẩm chuẩn |
| `category_id` | INT | FK | NOT NULL | Tham chiếu tới categories.category_id |
| `unit` | VARCHAR(20) | - | NOT NULL | Đơn vị tính chuẩn (Ví dụ: Kg, Quả, Bó) |

---

## 5. Bảng `shopping_lists`
**Mô tả:** Quản lý các đợt đi chợ của gia đình.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `list_id` | INT | PK | AUTO_INCREMENT | Mã định danh danh sách mua sắm |
| `group_id` | INT | FK | NOT NULL | Tham chiếu tới family_groups.group_id |
| `name` | VARCHAR(100) | - | NOT NULL | Tên danh sách đi chợ |
| `created_at` | DATETIME | - | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo danh sách |
| `type` | VARCHAR(20) | - | NULL | Loại danh sách (Ví dụ: Hàng ngày, Hàng tuần) |

---

## 6. Bảng `shopping_list_items`
**Mô tả:** Chi tiết các món đồ cần mua trong một danh sách cụ thể.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `item_id` | INT | PK | AUTO_INCREMENT | Mã định danh chi tiết món cần mua |
| `list_id` | INT | FK | NOT NULL | Tham chiếu tới shopping_lists.list_id |
| `food_id` | INT | FK | NOT NULL | Tham chiếu tới food_catalog.food_id |
| `quantity` | DECIMAL(10,2) | - | NOT NULL, > 0 | Số lượng cần mua |
| `status` | VARCHAR(20) | - | DEFAULT 'Pending' | Trạng thái món đồ (Pending, Bought) |

---

## 7. Bảng `inventory`
**Mô tả:** Quản lý thực phẩm hiện có trong tủ lạnh của gia đình.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `inventory_id` | INT | PK | AUTO_INCREMENT | Mã định danh dòng tồn kho |
| `group_id` | INT | FK | NOT NULL | Tham chiếu tới family_groups.group_id |
| `food_id` | INT | FK | NOT NULL | Tham chiếu tới food_catalog.food_id |
| `quantity` | DECIMAL(10,2) | - | NOT NULL, >= 0 | Số lượng tồn kho hiện tại |
| `expiry_date` | DATE | - | NOT NULL | Hạn sử dụng của thực phẩm |
| `location` | VARCHAR(50) | - | NOT NULL | Vị trí lưu trữ (Ngăn đông, Ngăn mát) |

---

## 8. Bảng `recipes`
**Mô tả:** Quản lý các công thức nấu ăn hệ thống hoặc do người dùng đóng góp.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `recipe_id` | INT | PK | AUTO_INCREMENT | Mã định danh công thức nấu ăn |
| `name` | VARCHAR(200) | - | NOT NULL | Tên món ăn |
| `instructions` | TEXT | - | NOT NULL | Chi tiết các bước chế biến |
| `image_url` | VARCHAR(255) | - | NULL | Đường dẫn tới ảnh minh họa món ăn |
| `author_id` | INT | FK | NOT NULL | Tham chiếu tới users.user_id (Người đóng góp) |
| `status` | VARCHAR(20) | - | DEFAULT 'Pending' | Trạng thái hiển thị (Pending, Approved) |

---

## 9. Bảng `recipe_ingredients`
**Mô tả:** Bảng trung gian quản lý nguyên liệu cấu thành nên một công thức.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `recipe_id` | INT | PK, FK | NOT NULL | Tham chiếu tới recipes.recipe_id |
| `food_id` | INT | PK, FK | NOT NULL | Tham chiếu tới food_catalog.food_id |
| `quantity_required` | DECIMAL(10,2) | - | NOT NULL, > 0 | Định lượng cần thiết để nấu món ăn |

---

## 10. Bảng `meal_plans`
**Mô tả:** Lịch trình lên thực đơn các bữa ăn của gia đình.

| Column Name | Data Type | Key | Constraints | Description |
|---|---|---|---|---|
| `plan_id` | INT | PK | AUTO_INCREMENT | Mã định danh của kế hoạch |
| `group_id` | INT | FK | NOT NULL | Tham chiếu tới family_groups.group_id |
| `date` | DATE | - | NOT NULL | Ngày thực hiện bữa ăn |
| `meal_type` | VARCHAR(20) | - | NOT NULL | Loại bữa ăn (Sáng, Trưa, Tối) |
| `recipe_id` | INT | FK | NOT NULL | Tham chiếu tới recipes.recipe_id |
| `is_completed` | BOOLEAN | - | DEFAULT FALSE | Đã hoàn tất bữa ăn hay chưa (0: Chưa, 1: Rồi) |

---

