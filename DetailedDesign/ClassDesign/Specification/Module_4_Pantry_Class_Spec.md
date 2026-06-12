# Đặc tả Lớp (Class Specification) - Module Pantry

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Pantry.

## 1. Views
### 1.1. Lớp `PantryDashboard`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.2. Lớp `Scanner`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `PantryApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/pantry`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/pantry`.
  - `+ findOne(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/pantry/:itemId`.
  - `+ update(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/pantry/:itemId`.
  - `+ remove(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/pantry/:itemId`.
  - `+ consume(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/pantry/:itemId/consume`.
  - `+ markWasted(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/pantry/:itemId/waste`.

## 3. Controllers
### 3.1. Lớp `PantryController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findOne(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ update(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ remove(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ consume(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ markWasted(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `PantryService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ findOne(data: any): any`: Xử lý logic và tương tác database.
  - `+ update(data: any): any`: Xử lý logic và tương tác database.
  - `+ remove(data: any): any`: Xử lý logic và tương tác database.
  - `+ consume(data: any): any`: Xử lý logic và tương tác database.
  - `+ markWasted(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `InventoryEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `inventory`.
- **Thuộc tính**:
  - `- inventory_id: INT`
  - `- group_id: INT`
  - `- food_id: INT`
  - `- quantity: DECIMAL`
  - `- expiry_date: DATE`
  - `- location: VARCHAR`

