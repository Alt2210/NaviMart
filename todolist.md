Định hướng backend
Nên xây backend tách riêng bằng NestJS + MongoDB/Mongoose. Lý do: dự án có nhiều module nghiệp vụ, auth/guard/role rõ ràng, cần cron job, validation DTO, service layer và sau này dễ thêm AI/notification. Nếu muốn nhẹ hơn có thể dùng Express, nhưng NestJS sẽ sạch hơn cho bài này.

Database MongoDB nên thiết kế theo hướng document, không bê nguyên db.md kiểu SQL sang. Các bảng quan hệ như shopping_list_items, recipe_ingredients, family_members có thể embed trong document để giảm join.

Module Backend Đề Xuất

auth

Register/login/logout, refresh token, social login mock hoặc chuẩn bị interface OAuth.
JWT access token + refresh token hash.
Guard: JwtAuthGuard, RolesGuard, FamilyPermissionGuard.
users

Profile cá nhân, avatar, email/phone, setup profile.
Settings thông báo: nhắc HSD, nhắc đi chợ.
families

Tạo nhóm gia đình mặc định sau đăng ký.
Invite code/QR token có hết hạn.
Join family, kick member, cập nhật role/permissions.
Permission nên gồm: manage_family, edit_pantry, edit_lists, edit_meals, view_reports.
catalog

Categories, food catalog, units.
Admin quản lý danh mục.
Search/autocomplete khi thêm món đi chợ hoặc pantry.
shopping-lists

CRUD danh sách đi chợ.
Add/update/delete item.
Check item đã mua.
Complete shopping list: dùng transaction MongoDB để chuyển item đã mua sang pantry.
pantry

CRUD thực phẩm trong tủ.
Filter theo location/category/expiry status.
Update quantity, mark used up, mark wasted.
API lấy danh sách sắp hết hạn cho Home Dashboard.
recipes

CRUD/search recipe.
Recipe detail gồm ingredients, steps, nutrition, image, difficulty, cook time.
API kiểm tra nguyên liệu thiếu so với pantry.
meals

Meal planner theo ngày/tuần.
Custom meal sessions: breakfast/lunch/dinner/snack/custom.
Generate shopping list từ nguyên liệu còn thiếu.
suggestions

Giai đoạn đầu dùng rule-based: ưu tiên món dùng thực phẩm sắp hết hạn, match pantry ingredients.
Sau đó mới thêm AI Chef/chat.
reports

Thống kê đã mua theo thời gian.
Thống kê tiêu thụ.
Waste report: item hết hạn/vứt bỏ.
notifications
Cron job mỗi ngày scan pantry item còn <= 3 ngày hoặc đã hết hạn.
Lưu notification trong DB trước, push notification làm sau.
MongoDB Collections Nên Có

users

email, phone, passwordHash, name, avatarUrl, role, status, settings, refreshTokenHash
Index unique: email, phone.
families

name, ownerId, members: [{ userId, role, permissions, joinedAt }]
inviteCodes: [{ codeHash, permissions, expiresAt, usedAt }]
Index: ownerId, members.userId.
categories

name, slug, type.
foods

name, normalizedName, categoryId, defaultUnit, storageTips.
Index text: name, normalizedName.
shoppingLists

familyId, name, type, status: active/completed/archived
items: [{ foodId, name, quantity, unit, categoryId, checked, boughtAt, note }]
createdBy, completedAt.
Index: familyId,status,createdAt.
pantryItems

familyId, foodId, name, quantity, unit, expiryDate, location, categoryId
source: manual/shopping/meal, status: active/used_up/wasted/expired
Index: familyId,expiryDate, familyId,location.
recipes

name, ingredients: [{ foodId, name, quantity, unit }], steps, nutrition, cookTime, difficulty, imageUrl, authorId, status.
Index text: name, ingredients.name.
mealPlans

familyId, date, session, recipeId, customName, servings, isCompleted.
Index: familyId,date.
notifications

userId, familyId, type, title, body, data, readAt.
inventoryEvents

Audit log cho pantry: added, consumed, wasted, expired, adjusted.
Rất hữu ích cho Reports.
API Ưu Tiên MVP

Auth/Profile:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/users/me
PUT /api/users/me
Family:

GET /api/family
POST /api/family
POST /api/family/invite
POST /api/family/join
PATCH /api/family/members/:memberId
DELETE /api/family/members/:memberId
Shopping:

GET /api/shopping-lists?status=active
POST /api/shopping-lists
GET /api/shopping-lists/:id
PATCH /api/shopping-lists/:id
DELETE /api/shopping-lists/:id
POST /api/shopping-lists/:id/items
PATCH /api/shopping-lists/:id/items/:itemId
DELETE /api/shopping-lists/:id/items/:itemId
POST /api/shopping-lists/:id/complete
Pantry:

GET /api/pantry?location=&expiryStatus=&categoryId=
POST /api/pantry
PATCH /api/pantry/:id
DELETE /api/pantry/:id
POST /api/pantry/:id/consume
POST /api/pantry/:id/waste
GET /api/pantry/expiring-soon
Meals/Recipes:

GET /api/recipes
GET /api/recipes/:id
GET /api/recipes/:id/missing-ingredients
GET /api/meals?startDate=&endDate=
POST /api/meals
PATCH /api/meals/:id
DELETE /api/meals/:id
POST /api/meals/generate-shopping-list
Todo List Triển Khai

Khởi tạo backend NestJS, cấu hình env, MongoDB, Mongoose, validation pipe, Swagger.
Tạo schema nền: users, families, foods, categories.
Làm auth JWT + refresh token + guards.
Làm family sharing + permission guard.
Làm shopping list CRUD và item CRUD.
Làm pantry CRUD.
Làm flow quan trọng nhất: complete shopping list -> add checked items to pantry.
Làm expiry status logic: safe / expiring / expired.
Làm cron notification HSD và collection notifications.
Làm recipes + search + recipe detail.
Làm meal planner + missing ingredients.
Làm generate shopping list từ meal plan/recipe.
Làm reports dựa trên shoppingLists, pantryItems, inventoryEvents.
Seed data: categories, units, foods mẫu, recipes mẫu.
Viết Swagger docs + Postman collection.
Test các flow chính bằng integration tests.