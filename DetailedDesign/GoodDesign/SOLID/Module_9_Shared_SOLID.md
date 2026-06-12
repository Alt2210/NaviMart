# Đánh giá nguyên lý SOLID - Module 9 (Shared)

## 1. Single Responsibility Principle (SRP)
- `DialogContext` chỉ quản lý trạng thái và luồng hiển thị hộp thoại dùng chung. `SharedApiClient` chỉ đóng vai trò lớp giao tiếp API dùng chung, không chứa logic nghiệp vụ của các module cụ thể.

## 2. Open-Closed Principle (OCP)
- Các thành phần dùng chung như `DialogContext`, `SharedApiClient` và `SharedService` có thể mở rộng thêm hành vi chung mới thông qua interface hoặc wrapper mà không cần sửa trực tiếp logic của Auth, Family, Pantry, Shopping, Meals, Recipes, Reports hoặc Admin.

## 3. Liskov Substitution Principle (LSP)
- Các implementation thay thế cho lớp dùng chung, ví dụ một `MockSharedApiClient` trong kiểm thử hoặc `ProductionSharedApiClient` trong môi trường thật, đều có thể thay thế nhau miễn là tuân thủ cùng contract trả về dữ liệu và lỗi.

## 4. Interface Segregation Principle (ISP)
- Module Shared không ép các module khác phụ thuộc vào một interface lớn. Các chức năng dùng chung được tách theo mục đích như dialog, API client, notification helper hoặc utility service để module sử dụng chỉ import phần cần thiết.

## 5. Dependency Inversion Principle (DIP)
- Các module nghiệp vụ phụ thuộc vào abstraction của dịch vụ dùng chung thay vì khởi tạo trực tiếp implementation. Cách này giúp dễ mock khi test và dễ thay đổi hạ tầng dùng chung mà không ảnh hưởng tới logic từng module.
