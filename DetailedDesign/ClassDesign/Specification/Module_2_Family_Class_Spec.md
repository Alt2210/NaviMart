# Đặc tả Lớp (Class Specification) - Module Family

Tài liệu mô tả chi tiết các phương thức và thuộc tính của các lớp trong Module Family.

## 1. Views
### 1.1. Lớp `FamilySharing`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.2. Lớp `Profile`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.3. Lớp `EditProfile`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

### 1.4. Lớp `Settings`
- **Stereotype**: `<<View>>`
- **Mô tả**: Component React quản lý giao diện người dùng hiển thị.
- **Phương thức**:
  - `+ render(): JSX.Element`: Render giao diện HTML/CSS.

## 2. API Clients
### 2.1. Lớp `FamilyApiClient`
- **Stereotype**: `<<API Client>>`
- **Mô tả**: Lớp gọi API bằng Axios để tương tác với Backend.
- **Thuộc tính**:
  - `- baseUrl: String`: URL gốc của backend.
- **Phương thức**:
  - `+ getCurrentFamily(data: any): Promise<any>`: Gửi HTTP `GET` request lên `/api/family`.
  - `+ create(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/family`.
  - `+ createInvite(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/family/invite`.
  - `+ join(data: any): Promise<any>`: Gửi HTTP `POST` request lên `/api/family/join`.
  - `+ updateMemberPermissions(data: any): Promise<any>`: Gửi HTTP `PATCH` request lên `/api/family/members/:memberId/permissions`.
  - `+ removeMember(data: any): Promise<any>`: Gửi HTTP `DELETE` request lên `/api/family/members/:memberId`.

## 3. Controllers
### 3.1. Lớp `FamilyController`
- **Stereotype**: `<<Controller>>`
- **Mô tả**: NestJS Controller nhận request từ Frontend.
- **Phương thức**:
  - `+ getCurrentFamily(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ create(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ createInvite(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ join(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ updateMemberPermissions(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.
  - `+ removeMember(@Body dto: any): Response`: Nhận request và gọi tới Service tương ứng.

## 4. Services
### 4.1. Lớp `FamilyService`
- **Stereotype**: `<<Service>>`
- **Mô tả**: Lớp chứa Business Logic xử lý nghiệp vụ chính.
- **Phương thức**:
  - `+ getCurrentFamily(data: any): any`: Xử lý logic và tương tác database.
  - `+ create(data: any): any`: Xử lý logic và tương tác database.
  - `+ createInvite(data: any): any`: Xử lý logic và tương tác database.
  - `+ join(data: any): any`: Xử lý logic và tương tác database.
  - `+ updateMemberPermissions(data: any): any`: Xử lý logic và tương tác database.
  - `+ removeMember(data: any): any`: Xử lý logic và tương tác database.

## 5. Entities
### 5.1. Lớp `FamilyGroupsEntity`
- **Stereotype**: `<<Entity>>`
- **Mô tả**: Đối tượng dữ liệu ánh xạ từ Database bảng `family_groups`.
- **Thuộc tính**:
  - `- group_id: INT`
  - `- group_name: VARCHAR`
  - `- owner_id: INT`
  - `- invite_code: VARCHAR`

### 5.2. Lớp `UsersEntity`
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

