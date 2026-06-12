# Đặc tả Lớp (Class Specification) - Module Reports

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Reports.

## 1. Views
### 1.1. Lớp `StatsDashboard`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `ReportsApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ getDashboard(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/reports/dashboard`.
  - `+ getConsumptionTrends(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/reports/consumption-trends`.
  - `+ getWasteReport(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/reports/waste`.

## 3. Controllers
### 3.1. Lớp `ReportsController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ getDashboard(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getConsumptionTrends(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getWasteReport(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `ReportsService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ getDashboard(data: any): any`: Xử lý logic và tương tác database.
  - `+ getConsumptionTrends(data: any): any`: Xử lý logic và tương tác database.
  - `+ getWasteReport(data: any): any`: Xử lý logic và tương tác database.

