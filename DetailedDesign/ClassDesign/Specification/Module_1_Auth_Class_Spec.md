# Đặc tả Lớp (Class Specification) - Module Auth

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Auth.

## 1. Views
### 1.1. Lớp `ForgotPassword`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.2. Lớp `Login`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.3. Lớp `Onboarding`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.4. Lớp `Register`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.5. Lớp `Splash`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `AuthApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ register(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/register`.
  - `+ login(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/login`.
  - `+ refresh(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/refresh`.
  - `+ logout(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/logout`.
  - `+ forgotPassword(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/forgot-password`.
  - `+ resetPassword(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/reset-password`.
  - `+ sendVerification(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/send-verification`.
  - `+ verifyEmail(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/auth/verify-email`.

## 3. Controllers
### 3.1. Lớp `AuthController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ register(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ login(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ refresh(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ logout(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ forgotPassword(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ resetPassword(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ sendVerification(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ verifyEmail(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `AuthService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ register(data: any): any`: Xử lý logic và tương tác database.
  - `+ login(data: any): any`: Xử lý logic và tương tác database.
  - `+ refresh(data: any): any`: Xử lý logic và tương tác database.
  - `+ logout(data: any): any`: Xử lý logic và tương tác database.
  - `+ forgotPassword(data: any): any`: Xử lý logic và tương tác database.
  - `+ resetPassword(data: any): any`: Xử lý logic và tương tác database.
  - `+ sendVerification(data: any): any`: Xử lý logic và tương tác database.
  - `+ verifyEmail(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `UsersEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `users`.
- **Thuộc tính**:
  - `- user_id: INT`
  - `- email: VARCHAR`
  - `- phone: VARCHAR`
  - `- password_hash: VARCHAR`
  - `- first_name: VARCHAR`
  - `- last_name: VARCHAR`
  - `- dob: DATE`
  - `- gender: VARCHAR`
  - `- role: VARCHAR`
  - `- group_id: INT`
  - `- status: VARCHAR`

