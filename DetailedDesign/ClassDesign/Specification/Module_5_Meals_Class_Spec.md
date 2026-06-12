# Đặc tả Lớp (Class Specification) - Module Meals

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Meals.

## 1. Views
### 1.1. Lớp `MealPlanner`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `MealsApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/meals`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/meals`.
  - `+ findOne(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/meals/:mealId`.
  - `+ getMissingIngredients(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/meals/:mealId/missing-ingredients`.
  - `+ generateShoppingList(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/meals/:mealId/generate-shopping-list`.
  - `+ update(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/meals/:mealId`.
  - `+ remove(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/meals/:mealId`.

## 3. Controllers
### 3.1. Lớp `MealsController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findOne(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getMissingIngredients(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ generateShoppingList(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ update(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ remove(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `MealsService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ findOne(data: any): any`: Xử lý logic và tương tác database.
  - `+ getMissingIngredients(data: any): any`: Xử lý logic và tương tác database.
  - `+ generateShoppingList(data: any): any`: Xử lý logic và tương tác database.
  - `+ update(data: any): any`: Xử lý logic và tương tác database.
  - `+ remove(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `MealPlansEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `meal_plans`.
- **Thuộc tính**:
  - `- plan_id: INT`
  - `- group_id: INT`
  - `- date: DATE`
  - `- meal_type: VARCHAR`
  - `- recipe_id: INT`
  - `- is_completed: BOOLEAN`

