# Đặc tả Lớp (Class Specification) - Module Recipes

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Recipes.

## 1. Views
### 1.1. Lớp `RecipeEditor`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.2. Lớp `RecipeDetail`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.3. Lớp `RecipeSuggestion`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `RecipesApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ findAll(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/recipes`.
  - `+ getSuggestions(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/recipes/suggestions`.
  - `+ findFavorites(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/recipes/favorites`.
  - `+ findOne(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/recipes/:recipeId`.
  - `+ addFavorite(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/recipes/:recipeId/favorite`.
  - `+ removeFavorite(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/recipes/:recipeId/favorite`.
  - `+ getMissingIngredients(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/recipes/:recipeId/missing-ingredients`.
  - `+ generateShoppingList(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/recipes/:recipeId/generate-shopping-list`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/recipes`.
  - `+ update(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/recipes/:recipeId`.
  - `+ remove(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/recipes/:recipeId`.

## 3. Controllers
### 3.1. Lớp `RecipesController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ findAll(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getSuggestions(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findFavorites(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ findOne(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ addFavorite(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeFavorite(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ getMissingIngredients(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ generateShoppingList(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ update(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ remove(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `RecipesService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ findAll(data: any): any`: Xử lý logic và tương tác database.
  - `+ getSuggestions(data: any): any`: Xử lý logic và tương tác database.
  - `+ findFavorites(data: any): any`: Xử lý logic và tương tác database.
  - `+ findOne(data: any): any`: Xử lý logic và tương tác database.
  - `+ addFavorite(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeFavorite(data: any): any`: Xử lý logic và tương tác database.
  - `+ getMissingIngredients(data: any): any`: Xử lý logic và tương tác database.
  - `+ generateShoppingList(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ update(data: any): any`: Xử lý logic và tương tác database.
  - `+ remove(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `RecipesEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `recipes`.
- **Thuộc tính**:
  - `- recipe_id: INT`
  - `- name: VARCHAR`
  - `- instructions: TEXT`
  - `- image_url: VARCHAR`
  - `- author_id: INT`
  - `- status: VARCHAR`

### 5.2. Lớp `RecipeIngredientsEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `recipe_ingredients`.
- **Thuộc tính**:
  - `- recipe_id: INT`
  - `- food_id: INT`
  - `- quantity_required: DECIMAL`

