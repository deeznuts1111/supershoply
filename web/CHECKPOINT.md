# Checkpoint M1 — Test Plan

## UI
1. /shop
   - Tìm với từ khóa (vd: "sản") → danh sách lọc tương ứng, URL có ?q=áo&page=1.
   - Chuyển trang Prev/Next → giữ từ khóa.
2. /shop/[slug]
   - Slug hợp lệ hiển thị chi tiết; thêm vào giỏ → badge tăng.
   - Slug sai → UI not-found custom.
3. /cart
   - Tăng/giảm số lượng, xoá, xoá toàn bộ → subtotal/total cập nhật.
   - Refresh → giỏ hàng vẫn còn (persist).
4. /login & /register
   - Nhập sai định dạng → hiển thị lỗi Zod theo field.

## API
- GET /api/health → `{ ok: true, version: "m1", products: <n> }`.
- GET /api/products?page=1&limit=8&q=ao → trả `{ data, page, limit, total, hasNext }`.
- GET /api/products/{slug} → 200 (đúng slug) hoặc 404 (sai).