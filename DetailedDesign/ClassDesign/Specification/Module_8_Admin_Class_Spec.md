# Đặc tả Lớp (Class Specification) - Module Admin

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Admin.

## 1. Views
### 1.1. Lớp `AdminDashboard`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `AdminApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ findAllCategories(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/catalog/categories`.
  - `+ createCategory(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/admin/catalog/categories`.
  - `+ updateCategory(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/admin/catalog/categories/:categoryId`.
  - `+ removeCategory(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/admin/catalog/categories/:categoryId`.
  - `+ findAllFoods(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/catalog/foods`.
  - `+ createFood(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/admin/catalog/foods`.
  - `+ updateFood(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/admin/catalog/foods/:foodId`.
  - `+ removeFood(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/admin/catalog/foods/:foodId`.
  - `+ findAllUnits(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/catalog/units`.
  - `+ createUnit(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/admin/catalog/units`.
  - `+ updateUnit(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/admin/catalog/units/:unitId`.
  - `+ removeUnit(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/admin/catalog/units/:unitId`.
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/recipes`.
  - `+ updateStatus(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/admin/recipes/:recipeId/status`.
  - `+ getStats(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/stats`.
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/users`.
  - `+ findOne(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/admin/users/:userId`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/admin/users`.
  - `+ update(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/admin/users/:userId`.
  - `+ remove(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/admin/users/:userId`.

## 3. Controllers
### 3.1. Lớp `AdminController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ findAllCategories(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ createCategory(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateCategory(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeCategory(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findAllFoods(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ createFood(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateFood(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeFood(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findAllUnits(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ createUnit(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateUnit(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeUnit(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateStatus(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getStats(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findOne(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ update(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ remove(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `AdminService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ findAllCategories(data: any): any`: Xử lý logic và tương tác database.
  - `+ createCategory(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateCategory(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeCategory(data: any): any`: Xử lý logic và tương tác database.
  - `+ findAllFoods(data: any): any`: Xử lý logic và tương tác database.
  - `+ createFood(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateFood(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeFood(data: any): any`: Xử lý logic và tương tác database.
  - `+ findAllUnits(data: any): any`: Xử lý logic và tương tác database.
  - `+ createUnit(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateUnit(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeUnit(data: any): any`: Xử lý logic và tương tác database.
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateStatus(data: any): any`: Xử lý logic và tương tác database.
  - `+ getStats(data: any): any`: Xử lý logic và tương tác database.
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ findOne(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ update(data: any): any`: Xử lý logic và tương tác database.
  - `+ remove(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `CategoriesEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `categories`.
- **Thuộc tính**:
  - `- category_id: INT`
  - `- name: VARCHAR`

### 5.2. Lớp `FoodCatalogEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `food_catalog`.
- **Thuộc tính**:
  - `- food_id: INT`
  - `- name: VARCHAR`
  - `- category_id: INT`
  - `- unit: VARCHAR`

