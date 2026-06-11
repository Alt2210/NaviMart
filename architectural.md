# Danh sách Checklist Tiến độ Đặc tả Hệ thống NaviMart (Architectural & UML Diagrams)

Tài liệu này dùng để theo dõi tiến độ hoàn thiện các biểu đồ (Analysis Diagram, Sequence Diagram, Communication Diagram) cho từng Use Case (UC) đã được phân rã chi tiết nhất theo chuẩn đặc tả yêu cầu phần mềm (SRS).

## 1. Phân hệ Xác thực & Quản lý Tài khoản (Authentication & Profile)
*Mô tả: Nhóm chức năng xử lý định danh người dùng và quản lý thông tin cá nhân.*
- [ ] **UC1.1: Đăng ký tài khoản (bằng Email/SĐT)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.2: Đăng nhập hệ thống (Email/SĐT & Mật khẩu)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.3: Đăng nhập qua mạng xã hội (OAuth Google/Facebook)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.4: Quên mật khẩu & Đặt lại mật khẩu**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.5: Xem thông tin cá nhân (Profile)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.6: Cập nhật thông tin cá nhân (Sửa tên, avatar, số điện thoại)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.7: Đổi mật khẩu**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC1.8: Đăng xuất khỏi hệ thống**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 2. Phân hệ Quản lý Nhóm Gia Đình (Family Sharing)
*Mô tả: Nhóm chức năng cốt lõi cho phép nhiều người dùng (vợ, chồng, con cái) cùng quản lý chung 1 tủ lạnh và 1 danh sách đi chợ.*
- [ ] **UC2.1: Tạo nhóm gia đình (Người tạo trở thành Owner)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.2: Xem thông tin nhóm gia đình & Danh sách thành viên**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.3: Tạo mã mời/Link mời thành viên mới vào nhóm (Có thời hạn)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.4: Tham gia nhóm gia đình qua mã mời/Link/QR Code**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.5: Cập nhật phân quyền cho thành viên (Chỉ Owner: Edit list, Edit pantry, View only)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.6: Xóa thành viên khỏi nhóm gia đình (Kick member - Chỉ Owner)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC2.7: Rời khỏi nhóm gia đình (Leave group)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 3. Phân hệ Quản lý Danh sách Mua sắm (Shopping List)
*Mô tả: Hỗ trợ người dùng lên danh sách những đồ cần mua trước khi ra siêu thị/chợ.*
- [ ] **UC3.1: Tạo mới danh sách mua sắm (Theo ngày/tuần hoặc sự kiện)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.2: Xem danh sách các danh sách mua sắm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.3: Sửa tên/Xóa danh sách mua sắm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.4: Thêm mặt hàng vào danh sách mua sắm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.5: Cập nhật thông tin mặt hàng cần mua (Số lượng, Đơn vị, Ghi chú)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.6: Xóa mặt hàng khỏi danh sách mua sắm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.7: Đánh dấu mặt hàng đã mua (Check item)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC3.8: Tự động chuyển hàng đã mua vào Kho thực phẩm (Khi hoàn tất đi chợ)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 4. Phân hệ Quản lý Tủ lạnh & Kho thực phẩm (Pantry Management)
*Mô tả: Quản lý đồ ăn đang có trong nhà (Tủ lạnh, tủ đông, kệ bếp) để tránh lãng phí.*
- [ ] **UC4.1: Xem danh sách thực phẩm trong kho (Có bộ lọc theo vị trí: tủ mát, tủ đông, tủ khô)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.2: Thêm mới thực phẩm vào tủ lạnh (Nhập thủ công)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.3: Cập nhật thông tin thực phẩm (Chỉnh sửa số lượng, Hạn sử dụng, Vị trí lưu trữ)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.4: Xóa/Thanh lý thực phẩm (Khi ăn hết hoặc vứt bỏ do hỏng)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.5: Tìm kiếm thực phẩm trong kho (Theo tên, loại)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.6: Tự động trừ số lượng thực phẩm trong kho khi xác nhận nấu một công thức**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC4.7: Gửi thông báo nhắc nhở thực phẩm sắp hết hạn (Ví dụ: Trước 2 ngày, 3 ngày)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 5. Phân hệ Lên Kế Hoạch Bữa Ăn (Meal Planner)
*Mô tả: Giúp nội trợ sắp xếp thực đơn cho cả tuần để không phải suy nghĩ "Hôm nay ăn gì?".*
- [ ] **UC5.1: Xem lịch trình bữa ăn (Theo ngày/Theo tuần)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC5.2: Tạo thêm phiên ăn (Session) trong ngày (Ví dụ: Bữa sáng, Trưa, Tối, Bữa phụ)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC5.3: Thêm món ăn vào một bữa ăn cụ thể trong lịch trình**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC5.4: Chỉnh sửa/Đổi món trong lịch trình**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC5.5: Xóa món ăn khỏi lịch trình bữa ăn**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 6. Phân hệ Gợi ý thông minh & Công thức nấu ăn (AI Recipes & Suggestions)
*Mô tả: Kho công thức và AI phân tích thực phẩm đang có để gợi ý món.*
- [ ] **UC6.1: Gợi ý món ăn tự động dựa trên thực phẩm sắp hết hạn trong tủ lạnh**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC6.2: Tìm kiếm công thức nấu ăn (Theo tên, nguyên liệu, tag)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC6.3: Xem chi tiết công thức nấu ăn (Nguyên liệu, Cách làm, Dinh dưỡng)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC6.4: Lưu/Bỏ lưu (Bookmark) công thức nấu ăn yêu thích**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC6.5: Tự động thêm các nguyên liệu còn thiếu của công thức vào Danh sách mua sắm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC6.6: Chat tương tác với AI Chef (Trợ lý ảo hướng dẫn nấu ăn)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 7. Phân hệ Báo cáo và Thống kê (Reports & Analytics)
*Mô tả: Giúp người dùng nhìn lại thói quen tiêu dùng để tối ưu chi phí.*
- [ ] **UC7.1: Xem biểu đồ thống kê thực phẩm đã mua (Theo thời gian/Danh mục)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC7.2: Xem báo cáo số lượng/giá trị thực phẩm bị lãng phí (Do hết hạn phải vứt bỏ)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram

## 8. Phân hệ Quản trị viên (Admin System)
*Mô tả: Dành cho Admin vận hành hệ thống.*
- [ ] **UC8.1: Đăng nhập quyền Quản trị viên**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.2: Xem danh sách toàn bộ người dùng hệ thống**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.3: Khóa/Mở khóa tài khoản người dùng vi phạm**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.4: Quản lý Master Data: Thêm/Sửa/Xóa Danh mục thực phẩm (Category)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.5: Quản lý Master Data: Thêm/Sửa/Xóa Đơn vị tính (Unit: kg, lit, hộp...)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.6: Kiểm duyệt công thức nấu ăn (Nếu cho phép user đóng góp công thức)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
- [ ] **UC8.7: Xem Dashboard thống kê tổng quan toàn hệ thống (DAU, MAU, Tổng user)**
  - [ ] Analysis Diagram | [ ] Sequence Diagram | [ ] Communication Diagram
