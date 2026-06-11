# Yêu cầu Phát triển Backend cho NaviMart

Tài liệu này tổng hợp các luồng tính năng và API cần thiết phía Backend để tích hợp với giao diện Frontend hiện tại của ứng dụng NaviMart.

## 1. Xác thực và Phân quyền (Authentication & Authorization)
- **POST /api/auth/register**: Đăng ký tài khoản mới bằng Tên, Email/SĐT và Mật khẩu.
- **POST /api/auth/login**: Đăng nhập bằng Email/SĐT và Mật khẩu. Hỗ trợ "Ghi nhớ đăng nhập" (trả về Refresh Token).
- **POST /api/auth/social**: Đăng nhập qua OAuth (Google, Facebook).
- Phân quyền theo token (JWT): Đảm bảo các API private (Pantry, Meals, Family...) chỉ được truy cập bởi người dùng đã đăng nhập.

## 2. Quản lý Nhóm Gia Đình (Family Sharing)
- **GET /api/family**: Lấy thông tin nhóm gia đình của user hiện tại (chủ nhóm, danh sách thành viên, quyền hạn).
- **POST /api/family/invite**: Tạo mã mời (hoặc link/QR code) với quyền tương ứng (ví dụ: `edit_list`, `edit_pantry`) có thời hạn (ví dụ 24h).
- **POST /api/family/join**: Xử lý tham gia nhóm thông qua mã mời hoặc mã QR.
- **PUT /api/family/members/:id/permissions**: Cập nhật quyền hạn của một thành viên trong nhóm (Chỉ Owner mới có quyền này).
- **DELETE /api/family/members/:id**: Xóa/Kick một thành viên khỏi nhóm gia đình.

## 3. Kho Thực Phẩm (Pantry Management)
- **GET /api/pantry**: Lấy danh sách thực phẩm trong tủ lạnh. Hỗ trợ filter/sort theo danh mục (Tủ mát, Tủ đông, Tủ khô) và hạn sử dụng.
- **POST /api/pantry**: Thêm mới thực phẩm (Tên, Số lượng, Đơn vị, Ngày hết hạn, Vị trí lưu trữ).
- **PUT /api/pantry/:id**: Chỉnh sửa thông tin thực phẩm.
- **DELETE /api/pantry/:id**: Xóa thực phẩm khỏi kho (do đã sử dụng hết hoặc vứt bỏ).
- **CRON Job**: Tự động push notification cho các thực phẩm sắp hoặc đã hết hạn (2 ngày, 3 ngày).

## 4. Lịch Trình Bữa Ăn (Meal Planner)
- **GET /api/meals?startDate=...&endDate=...**: Lấy danh sách lịch trình bữa ăn theo khoảng thời gian (ngày, tuần).
- **POST /api/meals/sessions**: Tạo thêm các phiên ăn (Session) trong một ngày (Ví dụ: Bữa xế, Ăn đêm) thay vì chỉ cố định Sáng/Trưa/Tối.
- **POST /api/meals**: Thêm món ăn mới vào một buổi ăn cụ thể trong ngày.
- **PUT /api/meals/:id**: Cập nhật thông tin bữa ăn/món ăn.
- **DELETE /api/meals/:id**: Xóa món ăn khỏi lịch trình.
- **GET /api/meals/suggestions**: Gọi engine gợi ý (có thể là AI hoặc logic map với database kho thực phẩm) để đề xuất món ăn dựa trên nguyên liệu sẵn có trong `Pantry` và thời gian nấu.

## 5. Danh Sách Mua Sắm (Shopping Lists)
- **GET /api/shopping-lists**: Lấy các danh sách đi chợ hiện có (ví dụ: Chợ cuối tuần, Siêu thị).
- **POST /api/shopping-lists**: Tạo danh sách mới.
- **POST /api/shopping-lists/:id/items**: Thêm món cần mua vào danh sách. (Nút "Thêm món" hoặc tự động gen từ Recipe Detail).
- **PUT /api/shopping-lists/:id/items/:itemId**: Đánh dấu đã mua (checked/unchecked) hoặc cập nhật số lượng.
- Tự động hóa: Khi check "đã mua" và hoàn tất đi chợ, tự động chuyển các item này vào Kho Thực Phẩm (Pantry).

## 6. Công Thức Nấu Ăn (Recipes & AI Chef)
- **GET /api/recipes**: Tìm kiếm và lấy danh sách công thức.
- **GET /api/recipes/:id**: Lấy chi tiết công thức (Nguyên liệu, Hướng dẫn từng bước, Dinh dưỡng, Thời gian nấu).
- **POST /api/ai-chef/chat**: Tích hợp AI (ví dụ: LLM) để chat với người dùng. User hỏi "Hôm nay nấu gì với thịt bò?", AI quét `Pantry` và trả lời + kèm theo công thức.

## 7. Hồ sơ cá nhân (Profile)
- **GET /api/users/me**: Lấy thông tin user (Tên, Avatar, SĐT, Email).
- **PUT /api/users/me**: Chỉnh sửa thông tin cá nhân.
- **POST /api/users/logout**: Hủy token, đăng xuất.

## 8. Cấu trúc DB Đề Xuất (Tham khảo)
1. **Users**: `id`, `name`, `email`, `phone`, `password_hash`, `family_id`
2. **Families**: `id`, `name`, `owner_id`
3. **Family_Members**: `family_id`, `user_id`, `role`, `permissions (json)`
4. **Pantry_Items**: `id`, `family_id`, `name`, `quantity`, `unit`, `expiry_date`, `location`
5. **Meals**: `id`, `family_id`, `date`, `session (breakfast/lunch/dinner/snack)`, `recipe_id`, `custom_name`
6. **Shopping_Lists**: `id`, `family_id`, `name`, `status`
7. **Shopping_List_Items**: `id`, `list_id`, `name`, `quantity`, `is_checked`

---
*Tài liệu này phản ánh những module giao diện đã được hoàn thiện. Team BE có thể bắt đầu thiết kế database schema và API docs dựa trên các endpoint này.*
