# Đánh giá Coupling & Cohesion - Module 9 (Shared)

## 1. Mức độ Cohesion (Gắn kết)
**Đánh giá:** Functional Cohesion

- Module Shared tập trung các thành phần dùng chung cho toàn hệ thống như context, API client, utility service và các helper không thuộc riêng một nghiệp vụ cụ thể.
- Các lớp trong module này cùng phục vụ mục tiêu giảm lặp lại và chuẩn hóa cách các module khác tương tác với hạ tầng chung.
- Việc gom các thành phần dùng chung vào Shared giúp tránh trộn logic hỗ trợ vào Auth, Pantry, Meals hoặc Admin, qua đó giữ cohesion của từng module nghiệp vụ.

## 2. Mức độ Coupling (Phụ thuộc)
**Đánh giá:** Data Coupling

- Các module khác giao tiếp với Shared thông qua tham số, DTO hoặc interface rõ ràng, không truy cập trực tiếp trạng thái nội bộ của Shared.
- Shared cung cấp dịch vụ nền tảng nhưng không phụ thuộc ngược vào nghiệp vụ cụ thể của từng module, nhờ đó tránh Common Coupling và Content Coupling.
- Khi cần thay đổi cơ chế dialog, API client hoặc service dùng chung, các module nghiệp vụ chỉ cần giữ nguyên contract đang sử dụng.
