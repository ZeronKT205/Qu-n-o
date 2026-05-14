# Frontend (React/Next.js) Coding Rules & Guidelines

Dự án Levents Clone sử dụng Next.js 14 (App Router) với ISR, tập trung vào hiệu năng, SEO và trải nghiệm người dùng (UX/UI). Dưới đây là các quy tắc cốt lõi khi phát triển Frontend.

## 1. Cấu trúc thư mục (Directory Structure)

Tất cả code FE nằm trong thư mục `src/`.
- `src/app/`: Chứa các page routes, layouts, và API routes (Next.js App Router).
- `src/components/`: Chứa các React components có thể tái sử dụng.
  - `ui/`: Các components cơ bản (Button, Input, Card).
  - `sections/`: Các components lớn ghép từ UI (HeroBanner, ProductSlider, Header, Footer).
  - `modals/`: Các popup, drawer (Quick View, Cart Drawer, Auth Modal).
- `src/hooks/`: Custom React hooks (VD: `useCart`, `useAuth`, `useMediaQuery`).
- `src/utils/`: Các hàm hỗ trợ (format tiền tệ, xử lý ngày tháng).
- `src/services/`: Gọi API backend (fetch data, mutation).
- `src/styles/`: Global CSS, CSS variables (nếu không dùng Tailwind).
- `src/types/`: TypeScript interfaces và types.

## 2. Quy tắc Component & UI/UX

- **Atomic Design**: Xây dựng UI từ nhỏ (atoms) đến lớn (organisms).
- **Responsive (Mobile-First)**: Đảm bảo UI hoạt động hoàn hảo trên 3 breakpoints:
  - Desktop: `≥ 1280px`
  - Tablet: `768px - 1279px`
  - Mobile: `≤ 767px`
- **Spacing System**: Tuân thủ base spacing `8px` (8, 16, 24, 32, 40, 48...).
- **Accessibility (WCAG 2.1 AA)**:
  - Mọi thẻ `<img>` phải có `alt`.
  - Nút bấm và form inputs phải có `aria-label` nếu không có text hiển thị rõ ràng.
  - Hỗ trợ thao tác bằng bàn phím (tab navigation).
- **Tương tác UX (Micro-interactions)**:
  - Sticky Header khi cuộn xuống.
  - Cart Drawer trượt từ cạnh phải thay vì chuyển trang.
  - Nút Add To Cart (ATC) cần có trạng thái loading/thành công rõ ràng.
  - Skeleton loading cho các nội dung gọi từ API.

## 3. Quản lý trạng thái (State Management)

- Dùng React Context hoặc Zustand cho global state đơn giản (giỏ hàng, trạng thái đăng nhập, UI toggles).
- Tránh dùng Redux trừ khi state thực sự quá phức tạp.
- Dùng Server Components (Next.js) càng nhiều càng tốt để giảm bundle size. Chỉ thêm `'use client'` ở những component cần tương tác trực tiếp (hooks, event listeners).

## 4. CSS & Styling

- Sử dụng **Vanilla CSS Modules** (`.module.css`) hoặc **CSS-in-JS** chuẩn hóa để đảm bảo component-scoped styling.
- **Design Tokens**: Lưu trữ màu sắc, font chữ, kích thước dưới dạng CSS Variables (`--color-primary`, `--font-main`).
- Font chữ: Mặc định dùng font hiện đại (Inter, Roboto, hoặc font riêng của Levents), ưu tiên load từ next/font.

## 5. Hiệu năng & SEO

- **Hình ảnh**: Bắt buộc dùng `next/image` để tự động tối ưu hóa format (WebP/AVIF), resize và lazy loading.
- **Data Fetching (ISR/SSG)**:
  - Dùng `fetch` với `{ next: { revalidate: 3600 } }` cho các dữ liệu ít thay đổi (Danh mục, Thông tin trang).
  - Dùng Server Components để fetch data trực tiếp trong page.
- **SEO Mọi Trang**:
  - Tối ưu Metadata (Title, Description).
  - Render Schema JSON-LD đầy đủ (Product, Organization, Breadcrumb).
  - Core Web Vitals mục tiêu: LCP < 2.5s, CLS < 0.1, INP < 200ms.

## 6. Tiêu chuẩn Code (Code Standards)

- **Ngôn ngữ**: TypeScript 100%. Không dùng kiểu `any`.
- **Linter & Formatter**: ESLint + Prettier tự động fix khi lưu file.
- **Quy tắc đặt tên**:
  - Components, Interfaces: `PascalCase` (vd: `ProductCard`, `IUser`).
  - Hàm, Biến, Hooks: `camelCase` (vd: `formatPrice`, `useCart`, `isSidebarOpen`).
  - Hằng số: `UPPER_SNAKE_CASE` (vd: `MAX_ITEMS_PER_PAGE`).

Tuân thủ nghiêm ngặt các quy tắc này sẽ giúp duy trì dự án Levents Clone ổn định, dễ mở rộng và đạt chất lượng "Sống chất mặc chất".
