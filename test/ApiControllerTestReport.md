# Tài liệu kiểm thử — Chiến lược kiểm thử & Thiết kế API/Controller Test

**Hệ thống: NaviMart — Hệ thống đi chợ & quản lý thực phẩm gia đình**
Môn: Phát triển phần mềm theo chuẩn kỹ năng ITSS
Phiên bản tài liệu: 0.1 · Phạm vi: **Chiến lược kiểm thử + API/Controller Test**

> Tài liệu này trình bày (A) chiến lược kiểm thử tổng thể của NaviMart và (B) thiết kế tầng
> **API/Controller Test**. Cách trình bày tham chiếu cấu trúc Test Documentation theo định
> hướng ITSS (ISO/IEC/IEEE 29119‑3), điều chỉnh cho backend NestJS. Bổ trợ cho
> `UnitTestReport.md` (đã ghi nhận phần Unit Test).

---

# Phần A — Chiến lược kiểm thử

## A.1. Mô hình phân tầng kiểm thử

NaviMart áp dụng mô hình **kim tự tháp kiểm thử**: nhiều test nhanh & rẻ ở đáy (unit), ít test
chậm & đắt ở đỉnh (e2e). Mỗi tầng chỉ **chứng minh đúng điều cần chứng minh**, không chồng lấn
mục tiêu.

```
            ▲  ít / chậm / sát thực tế
            │   ┌───────────────────────────┐
            │   │  E2E / Integration Test    │  AppModule + mongodb-memory-server
            │   ├───────────────────────────┤
            │   │  API / Controller Test     │  Nest Test + supertest + ValidationPipe
            │   ├───────────────────────────┤
            │   │  Unit Test (service/util)  │  Jest + mock model (KHÔNG chạm DB)
            ▼   └───────────────────────────┘
                nhiều / nhanh / cô lập
```

| Tầng | Mục tiêu chính | Công cụ | Đặc điểm |
|---|---|---|---|
| **Unit Test** | Logic nội bộ service/mapper/util; rule nghiệp vụ; nhánh exception | Jest + `createMockModel()` | Không chạy Nest context; dependency được mock; nhanh nhất |
| **API/Controller Test** | Hợp đồng API: route, HTTP method/status, validation, JSON, mapping lỗi, RBAC | Nest `Test` + supertest + `ValidationPipe` + override guard | Đi qua HTTP layer + pipe; service có thể mock; **không chạm DB** |
| **Integration / E2E Test** | Persistence, transaction, index, luồng nghiệp vụ thật end‑to‑end | `@nestjs/testing` + `mongodb-memory-server` + supertest | Nạp `AppModule`, DB thật trong RAM |

> **Bảo mật (Security)** không tách thành tầng riêng mà được **nhúng vào API/Controller Test**
> dưới dạng các testcase negative: thiếu token (401), thiếu quyền family/role (403).

## A.2. Nguyên tắc phân tầng
- **Unit Test** dùng để chứng minh business logic cục bộ — **không** kết luận về transaction/DB thật.
- **API/Controller Test** chứng minh **hợp đồng API ở từng controller** (status/validation/JSON/error). Khi mock service, nó **không** tự động chứng minh toàn bộ filter/guard chain trừ khi guard được dựng/override một cách có chủ đích.
- **Security testcase** bắt buộc kiểm tra **negative path**: không token, sai quyền, token sai — và xác minh **service không bị gọi** khi bị từ chối.
- **Integration/E2E** phải có datasource cô lập (memory‑server), không phụ thuộc DB cục bộ để kết quả lặp lại được.

## A.3. Công cụ & môi trường theo tầng
| Thành phần | Cấu hình quan sát được |
|---|---|
| Backend | NestJS 11, Mongoose 9, global prefix `api`, `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` |
| Unit (BE) | Jest 30 + ts-jest, `testRegex: .*\.spec\.ts$`, `rootDir: src` |
| API/Controller (đề xuất) | `@nestjs/testing` + `supertest` (đã có trong devDependencies) |
| Integration/E2E (sẵn có) | `mongodb-memory-server`, `test/jest-e2e.json` |
| Frontend | Vitest 4 + Testing Library + jsdom |

## A.4. Entry / Exit criteria
| Nhóm | Entry criteria | Exit criteria |
|---|---|---|
| Unit | Mã build được, spec đã định nghĩa, dependency test sẵn có | Targeted test pass; coverage đơn vị chọn ≥ ~80%; không failure không giải thích được |
| API/Controller | Controller + DTO ổn định; service mock được; `ValidationPipe`/guard cấu hình đúng test | Mọi testcase contract pass; mỗi endpoint rủi ro có testcase 401/403/400/404 phù hợp |
| Integration/E2E | Docker/memory‑server khởi động được, seed ổn định | Luồng chính pass; persistence/rollback xác minh; không phụ thuộc DB cục bộ |

## A.5. Ma trận truy vết loại kiểm thử × module
| Module | Unit | API/Controller | Integration/E2E |
|---|---|---|---|
| Auth | ✅ auth.service | ✅ auth.controller (HTTP) | ✅ luồng register/login (sẵn có) |
| Pantry | ✅ pantry.service | ✅ pantry.controller (HTTP) | ✅ luồng pantry |
| Recipes | ✅ recipes.service (ranking) | ✅ recipes.controller (HTTP) | ✅ gợi ý món |
| Families | ✅ families.service | ✅ family.controller (HTTP) | ✅ mời/join |
| Shopping Lists | ✅ shopping-lists.service | ✅ shopping-lists.controller (HTTP) | ✅ hoàn tất → kho |
| Meals / Reports | ✅ services | 🎯 (mở rộng sau) | ✅ flow |

> ✅ = đã có & pass · 🎯 = đề xuất mở rộng sau.

## A.6. Kỹ thuật thiết kế testcase
| Kỹ thuật | Áp dụng trong NaviMart |
|---|---|
| Equivalence Partitioning | body hợp lệ/không hợp lệ; recipe approved/archived |
| Boundary Value Analysis | `quantity` = 0 / âm / vượt tồn; chuỗi quá dài; khẩu phần biên |
| State Transition | pantry `active→used_up→active/wasted`; list `active→completed` |
| Negative Testing | not found, invite hết hạn, sai mật khẩu, body thừa field |
| RBAC Matrix | 401 chưa đăng nhập, 403 thiếu family‑permission/role, 200 khi đủ quyền |

---

# Phần B — Thiết kế API/Controller Test

## B.1. Mục tiêu API/Controller Test
Chứng minh **hợp đồng API (API contract)** ở mức controller, độc lập với MongoDB:
- Route, HTTP method, **HTTP status** đúng (200/201/400/401/403/404/409).
- **Validation** của DTO qua `ValidationPipe` (whitelist + forbidNonWhitelisted): body sai/thiếu/thừa field → 400.
- **Hình dạng JSON** phản hồi đúng hợp đồng frontend đang tiêu thụ.
- **Mapping lỗi**: `NotFoundException→404`, `ForbiddenException→403`, `BadRequest→400`, `Conflict→409`, `Unauthorized→401`.
- **RBAC**: guard chặn đúng; service **không** bị gọi khi bị từ chối.

## B.2. Hai mức kiểm thử controller

### B.2.1. Mức 1 — Delegation Unit Test (ĐÃ CÓ, đã pass)
Mức hiện có (xem `UnitTestReport.md` mục 7): khởi tạo `new XController(mockService)` và assert
controller **ủy quyền đúng tham số** xuống service. Nhanh, cô lập, nhưng **không** đi qua HTTP
layer/`ValidationPipe`/guard.

| Ưu điểm | Hạn chế |
|---|---|
| Cực nhanh, không cần Nest context | Không kiểm tra status code/validation/JSON thật |
| Khẳng định mapping tham số (`user`, dto, id) | Không kiểm tra guard/RBAC |

### B.2.2. Mức 2 — HTTP‑level API Test (ĐÃ HIỆN THỰC & PASS)
Dựng controller trong **Nest Test module** + **supertest**, gắn `ValidationPipe` giống production
và **override guard** để mô phỏng người dùng/role, **mock service** để cô lập khỏi DB. Đây là tầng
chứng minh *API contract* đúng nghĩa. Đã hiện thực qua helper dùng chung
`backend/test/utils/api-test-app.ts` (`createApiTestApp`) và các file
`backend/src/**/*.controller.api.spec.ts`.

## B.3. Cách tiếp cận kỹ thuật (helper đã hiện thực)

Helper dùng chung `backend/test/utils/api-test-app.ts` dựng app theo đúng cấu hình `main.ts`
(prefix `api`, `ValidationPipe` whitelist + forbidNonWhitelisted + transform) và override guard:
- `authGuards` → guard bơm `req.user` từ `authState`, **ném 401** khi `authState.user = null`.
- `permissionGuards` → guard **ném 403** khi `permState.allow = false` (kiểm tra RBAC / family‑permission).

```ts
// trích backend/test/utils/api-test-app.ts
const authGuard = {
  canActivate: (ctx) => {
    if (!authState.user) throw new UnauthorizedException();   // → 401
    ctx.switchToHttp().getRequest().user = authState.user;
    return true;
  },
};
const permissionGuard = {
  canActivate: (ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (authState.user && !req.user) req.user = authState.user;
    if (!permState.allow) throw new ForbiddenException();      // → 403
    return true;
  },
};
// builder.overrideGuard(JwtAuthGuard).useValue(authGuard) ...
// app.setGlobalPrefix('api'); app.useGlobalPipes(new ValidationPipe({ whitelist, forbidNonWhitelisted, transform }));
```

Mỗi spec mock service và lật `authState.user` / `permState.allow` theo từng testcase:

```ts
// trích pantry.controller.api.spec.ts
it('API-PAN-005: consume quantity ≤ 0 → 400, service không gọi', async () => {
  await request(app.getHttpServer())
    .post('/api/pantry/abc/consume').send({ quantity: 0 }).expect(400);
  expect(pantryService.consume).not.toHaveBeenCalled();
});
```

**Lưu ý thiết kế:**
- `app.setGlobalPrefix('api')` + `ValidationPipe` **giống `main.ts`** để test phản ánh production.
- Guard chạy **trước** `ValidationPipe`: testcase 401/403 trả mã đúng kể cả khi body chưa được validate.
- Mock service trả lỗi (`mockRejectedValue(new NotFoundException())`) để kiểm tra **mapping** sang 404/409/400.
- Status gốc bám theo controller (`@HttpCode(200)` cho login/consume/waste/complete; mặc định 201 cho POST tạo mới).

## B.4. Quy ước mã testcase API
| Prefix | Module | Ví dụ |
|---|---|---|
| `API-AUTH-*` | Auth | `API-AUTH-003` |
| `API-PAN-*` | Pantry | `API-PAN-005` |
| `API-RCP-*` | Recipes | `API-RCP-002` |
| `API-FAM-*` | Family | `API-FAM-004` |
| `API-SL-*` | Shopping Lists | `API-SL-006` |

## B.5. Ma trận endpoint trong phạm vi
| Controller | Endpoint tiêu biểu | Guard |
|---|---|---|
| Auth | `POST /api/auth/{register,login,refresh,logout,forgot-password,reset-password,verify-email}` | JwtAuthGuard (logout, send-verification) |
| Pantry | `GET/POST /api/pantry`, `GET/PATCH/DELETE /api/pantry/:id`, `POST /api/pantry/:id/{consume,waste}` | JwtAuthGuard + FamilyPermissionGuard(`edit_pantry`) |
| Recipes | `GET /api/recipes{,/suggestions,/favorites,/:id}`, `POST/DELETE /api/recipes/:id/favorite`, `POST /api/recipes` | JwtAuthGuard + RolesGuard / FamilyPermissionGuard |
| Family | `GET/POST /api/family`, `POST /api/family/{invite,join}`, `PATCH/DELETE /api/family/members/:id...` | JwtAuthGuard + FamilyPermissionGuard(`manage_family`) |
| Shopping Lists | `GET/POST /api/shopping-lists`, `.../:id/items`, `.../:id/complete` | JwtAuthGuard + FamilyPermissionGuard(`edit_lists`) |

## B.6. Bảng testcase API/Controller (mức HTTP)

> Các testcase dưới đây **đã hiện thực và Pass** (chạy `cd backend && npm test`).
> Mức delegation tương ứng (`TC-CTL-*`) cũng Pass — xem `UnitTestReport.md` mục 7.

### B.6.1. Auth API (`API-AUTH-*`)
| Mã | Mục tiêu | Tiền điều kiện | Request/Thao tác | Kết quả mong đợi | Status |
|---|---|---|---|---|---|
| API-AUTH-001 | Đăng ký hợp lệ | service.register trả user+tokens | `POST /api/auth/register` body hợp lệ | 201; body có `user`,`tokens` | Pass |
| API-AUTH-002 | Body thiếu field bắt buộc → 400 | — | `POST /api/auth/register` thiếu `password` | 400; `message` mảng lỗi; service không gọi | Pass |
| API-AUTH-003 | Body thừa field lạ → 400 | whitelist bật | `POST /api/auth/register` thêm `hacker:1` | 400 (forbidNonWhitelisted) | Pass |
| API-AUTH-004 | Email/phone trùng → 409 | service ném `ConflictException` | `POST /api/auth/register` | 409 | Pass |
| API-AUTH-005 | Login đúng (HttpCode 200) | service trả tokens | `POST /api/auth/login` | 200; body có `tokens` | Pass |
| API-AUTH-006 | Sai credential → 401 | service ném `UnauthorizedException` | `POST /api/auth/login` | 401 | Pass |
| API-AUTH-007 | Refresh unwrap đúng field | service.refresh trả tokens | `POST /api/auth/refresh` body `{refreshToken}` | 200; `service.refresh('tok')` | Pass |
| API-AUTH-008 | logout không token → 401 | guard từ chối | `POST /api/auth/logout` không Bearer | 401; service không gọi | Pass |
| API-AUTH-009 | forgot-password luôn 200 | bất kỳ | `POST /api/auth/forgot-password` | 200 `{success:true}` | Pass |
| API-AUTH-010 | verify-email token sai → 400 | service ném `BadRequest` | `POST /api/auth/verify-email` | 400 | Pass |

### B.6.2. Pantry API (`API-PAN-*`)
| Mã | Mục tiêu | Tiền điều kiện | Request/Thao tác | Kết quả mong đợi | Status |
|---|---|---|---|---|---|
| API-PAN-001 | List pantry của family | đăng nhập | `GET /api/pantry?status=active` | 200; mảng item; service nhận `user,query` | Pass |
| API-PAN-002 | Chưa đăng nhập → 401 | currentUser=null | `GET /api/pantry` | 401 | Pass |
| API-PAN-003 | Tạo item thiếu quyền → 403 | FamilyPermissionGuard từ chối | `POST /api/pantry` | 403; service không gọi | Pass |
| API-PAN-004 | Tạo item body sai (quantity âm) → 400 | có quyền | `POST /api/pantry` `{quantity:-1}` | 400 | Pass |
| API-PAN-005 | consume quantity ≤ 0 → 400 | có quyền | `POST /api/pantry/:id/consume` `{quantity:0}` | 400; service không gọi | Pass |
| API-PAN-006 | consume vượt tồn → 400 (mapping) | service ném `BadRequest` | `POST /api/pantry/:id/consume` | 400 | Pass |
| API-PAN-007 | item không tồn tại → 404 | service ném `NotFound` | `GET /api/pantry/:id` | 404 | Pass |
| API-PAN-008 | waste trả 200 | service ok | `POST /api/pantry/:id/waste` | 200; item `wasted` | Pass |

### B.6.3. Recipes API (`API-RCP-*`)
| Mã | Mục tiêu | Tiền điều kiện | Request/Thao tác | Kết quả mong đợi | Status |
|---|---|---|---|---|---|
| API-RCP-001 | Tìm kiếm recipe | đăng nhập | `GET /api/recipes?q=pho` | 200; mảng; ép kiểu query đúng | Pass |
| API-RCP-002 | Gợi ý món | đăng nhập | `GET /api/recipes/suggestions?limit=5` | 200; mảng suggestion | Pass |
| API-RCP-003 | missing-ingredients unwrap servings | service ok | `GET /api/recipes/:id/missing-ingredients?servings=4` | 200; `service(user,id,4)` | Pass |
| API-RCP-004 | recipe archived → 404 | service ném `NotFound` | `GET /api/recipes/:id` | 404 | Pass |
| API-RCP-005 | Tạo recipe sai role → 403 | RolesGuard từ chối | `POST /api/recipes` (role không hợp lệ) | 403 | Pass |
| API-RCP-006 | Tạo recipe body sai → 400 | role hợp lệ | `POST /api/recipes` thiếu `name` | 400 | Pass |
| API-RCP-007 | addFavorite | đăng nhập | `POST /api/recipes/:id/favorite` | 201; `{isFavorite:true}` | Pass |

### B.6.4. Family API (`API-FAM-*`)
| Mã | Mục tiêu | Tiền điều kiện | Request/Thao tác | Kết quả mong đợi | Status |
|---|---|---|---|---|---|
| API-FAM-001 | Lấy family hiện tại | đăng nhập, có family | `GET /api/family` | 200; family JSON | Pass |
| API-FAM-002 | Không có family → 404 | service ném `NotFound` | `GET /api/family` | 404 | Pass |
| API-FAM-003 | Tạo invite thiếu quyền → 403 | FamilyPermissionGuard(`manage_family`) từ chối | `POST /api/family/invite` | 403; service không gọi | Pass |
| API-FAM-004 | Join mã sai/hết hạn → 404 | service ném `NotFound` | `POST /api/family/join` | 404 | Pass |
| API-FAM-005 | Join khi đã là member → 409 | service ném `Conflict` | `POST /api/family/join` | 409 | Pass |
| API-FAM-006 | Cập nhật quyền owner → 403 | service ném `Forbidden` | `PATCH /api/family/members/:id/permissions` | 403 | Pass |
| API-FAM-007 | Tự sửa quyền mình → 400 | service ném `BadRequest` | `PATCH /api/family/members/:self/permissions` | 400 | Pass |

### B.6.5. Shopping Lists API (`API-SL-*`)
| Mã | Mục tiêu | Tiền điều kiện | Request/Thao tác | Kết quả mong đợi | Status |
|---|---|---|---|---|---|
| API-SL-001 | Tạo list | có quyền `edit_lists` | `POST /api/shopping-lists` `{name}` | 201; list JSON | Pass |
| API-SL-002 | Tạo list thiếu quyền → 403 | guard từ chối | `POST /api/shopping-lists` | 403 | Pass |
| API-SL-003 | Thêm item body sai → 400 | có quyền | `POST /api/shopping-lists/:id/items` thiếu `quantity` | 400 | Pass |
| API-SL-004 | list không tồn tại → 404 | service ném `NotFound` | `GET /api/shopping-lists/:id` | 404 | Pass |
| API-SL-005 | Hoàn tất list đã completed → 400 | service ném `BadRequest` | `POST /api/shopping-lists/:id/complete` | 400 | Pass |
| API-SL-006 | Hoàn tất hợp lệ → 200 + nhập kho | service ok | `POST /api/shopping-lists/:id/complete` | 200; `pantryItems` trả về | Pass |

## B.7. Kết quả thực thi

| Spec (HTTP API) | Testcase | Kết quả |
|---|---|---|
| `auth.controller.api.spec.ts` | API-AUTH-001..010 (10) | ✅ Pass |
| `pantry.controller.api.spec.ts` | API-PAN-001..008 (8) | ✅ Pass |
| `families.controller.api.spec.ts` | API-FAM-001..007 (7) | ✅ Pass |
| `recipes.controller.api.spec.ts` | API-RCP-001..007 (7) | ✅ Pass |
| `shopping-lists.controller.api.spec.ts` | API-SL-001..006 (6) | ✅ Pass |
| **Tổng API test** | **38** | ✅ Pass |

> Sau khi bổ sung tầng API test, toàn bộ backend là **21 suites / 176 tests — Pass** (`cd backend && npm test`):
> 138 unit (service/util/controller‑delegation) + 38 HTTP‑level API test.

## B.8. Đánh giá API/Controller Test
- **Điểm mạnh thiết kế:** phủ đủ ma trận status (200/201/400/401/403/404/409), kiểm tra `ValidationPipe` thật và RBAC ở mức HTTP mà **không cần DB** → nhanh, ổn định, đặt giữa Unit và E2E.
- **Ranh giới:** không thay thế E2E (không kiểm tra persistence/index/transaction). Guard `FamilyPermissionGuard`/`RolesGuard` được override nên RBAC sâu (object‑level theo dữ liệu DB) vẫn cần E2E xác minh.
- **Rủi ro:** nếu chỉ override guard luôn `true`, sẽ không chứng minh được nhánh từ chối → các testcase 401/403 phải dùng guard giả có khả năng từ chối (như khung mẫu B.3).

---

## C. Roadmap triển khai
1. ~~Tạo helper `backend/test/utils/api-test-app.ts`~~ → **Đã hoàn thành**.
2. ~~Hiện thực `*.controller.api.spec.ts` cho Auth/Pantry/Family/Recipes/Shopping Lists~~ → **Đã hoàn thành (38 test, Pass)**.
3. ~~Cập nhật Status → Pass~~ → **Đã hoàn thành**.
4. (Còn lại) Mở rộng API test cho `meals`, `notifications`, `reports`, `admin-*`.
5. (Còn lại) Bổ sung `coverageThreshold` và CI (GitHub Actions) chạy cả unit + api spec.

---

*Tham chiếu: `UnitTestReport.md` (Unit Test đã thực thi), mã nguồn controller `backend/src/**/*.controller.ts`, cấu hình `backend/src/main.ts`.*
