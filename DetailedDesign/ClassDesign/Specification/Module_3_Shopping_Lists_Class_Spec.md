# Đặc tả Lớp (Class Specification) - Module Shopping_Lists

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Shopping_Lists.

## 1. Views
### 1.1. Lớp `MyLists`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.2. Lớp `ListDetail`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `ShoppingListsApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/shopping-lists`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/shopping-lists`.
  - `+ findOne(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/shopping-lists/:listId`.
  - `+ update(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/shopping-lists/:listId`.
  - `+ remove(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/shopping-lists/:listId`.
  - `+ complete(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/shopping-lists/:listId/complete`.
  - `+ addItem(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/shopping-lists/:listId/items`.
  - `+ updateItem(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/shopping-lists/:listId/items/:itemId`.
  - `+ removeItem(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/shopping-lists/:listId/items/:itemId`.

## 3. Controllers
### 3.1. Lớp `ShoppingListsController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findOne(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ update(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ remove(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ complete(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ addItem(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateItem(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeItem(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `ShoppingListsService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ findOne(data: any): any`: Xử lý logic và tương tác database.
  - `+ update(data: any): any`: Xử lý logic và tương tác database.
  - `+ remove(data: any): any`: Xử lý logic và tương tác database.
  - `+ complete(data: any): any`: Xử lý logic và tương tác database.
  - `+ addItem(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateItem(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeItem(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `ShoppingListsEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `shopping_lists`.
- **Thuộc tính**:
  - `- list_id: INT`
  - `- group_id: INT`
  - `- name: VARCHAR`
  - `- created_at: DATETIME`
  - `- type: VARCHAR`

### 5.2. Lớp `ShoppingListItemsEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `shopping_list_items`.
- **Thuộc tính**:
  - `- item_id: INT`
  - `- list_id: INT`
  - `- food_id: INT`
  - `- quantity: DECIMAL`
  - `- status: VARCHAR`

