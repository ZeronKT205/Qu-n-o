# LEVENTS CLONE - TÀI LIỆU KIẾN TRÚC KỸ THUẬT (ARCHITECTURE)

**Version 2.0 | Phiên bản Fullstack E-Commerce | Bắt buộc tuân thủ cho mọi thành viên dự án**

---

## 0. MỤC TIÊU TÀI LIỆU
Tài liệu này định nghĩa cấu trúc dự án, tech stack, quy ước đặt tên và workflow bắt buộc cho toàn bộ nền tảng Levents Clone (bao gồm cả Frontend và Backend). Mục tiêu:
1. **Thống nhất codebase**: Mọi module có cùng cấu trúc thư mục, naming convention.
2. **Khả năng mở rộng (Scalability)**: Xây dựng cấu trúc Backend linh hoạt để dễ dàng thêm tính năng.
3. **Hiệu suất & Bảo mật**: Chuẩn hóa việc validate dữ liệu, xử lý lỗi, và tracking hiệu quả.

---

## 1. TECH STACK CHÍNH THỨC

Đây là bộ công nghệ DUY NHẤT được sử dụng. Bất kỳ thay đổi nào cũng cần sự phê duyệt từ Technical Lead/CTO.

### 1.1 Frontend (FE)
| Công nghệ | Phiên bản | Mục đích | Ghi chú |
| --- | --- | --- | --- |
| **Next.js** | 14.x (App Router) | Framework chính, routing, SSR/SSG | KHÔNG dùng Pages Router |
| **TypeScript** | 5.x | Type safety toàn codebase | `strict` mode bật, cấm dùng `any` |
| **Tailwind CSS** | 3.x | Styling | CSS thuần chỉ viết tại `globals.css` |
| **Zustand** | 4.x | Global State Management | Quản lý Giỏ hàng, User session |
| **shadcn/ui** | Latest | UI Components (Button, Dialog) | Dùng chung với Tailwind & Radix UI |
| **Lucide React** | Latest | Icon set | `import { IconName } from 'lucide-react'` |

### 1.2 Backend (BE)
| Công nghệ | Phiên bản | Mục đích | Ghi chú |
| --- | --- | --- | --- |
| **Node.js** | 20.x LTS | Runtime Environment | |
| **Express.js** | 4.x | Web Framework | Nhẹ, dễ mở rộng |
| **TypeScript** | 5.x | Type safety | Cấm dùng `any` |
| **Prisma** | 5.x | ORM (Object-Relational Mapping) | Tương tác với Database an toàn, có auto-completion |
| **PostgreSQL** | 15.x | Database chính | Lưu trữ Products, Orders, Users |
| **Zod** | 3.x | Schema validation | Dùng để validate request body |
| **JWT** | 9.x | Authentication | Json Web Token |

---

## 2. CẤU TRÚC THƯ MỤC CHUẨN (MONOREPO LỎNG)

Dự án chia làm 2 thư mục chính: `fe` (Frontend) và `be` (Backend).

### 2.1 Cấu trúc Backend (`be/`)
Kiến trúc Model-View-Controller/Service phân lớp (Layered Architecture).

```text
be/
├── src/
│   ├── config/          # Cấu hình DB, Biến môi trường, Cors
│   ├── controllers/     # Nhận request, gọi service, trả về response HTTP
│   ├── middlewares/     # Authenticate, Error Handler, Validator (Zod)
│   ├── routes/          # Định nghĩa các endpoints RESTful API
│   ├── services/        # Logic nghiệp vụ lõi (Business logic & DB calls)
│   ├── utils/           # Helper functions, logger, formatters
│   └── index.ts         # Server entry point
├── prisma/
│   └── schema.prisma    # Khai báo cấu trúc bảng Database
├── .env.example
├── package.json
└── tsconfig.json
```

### 2.2 Cấu trúc Frontend (`fe/`)
Tuân thủ chuẩn Next.js App Router.

```text
fe/
├── src/
│   ├── app/             # App Router (Pages & Layouts)
│   ├── components/      # Shared components
│   │   ├── forms/       # Input, Select, Checkbox
│   │   ├── sections/    # ProductGrid, HeroBanner, Footer
│   │   └── ui/          # Nút bấm, Modal, Toast (shadcn/ui)
│   ├── data/            # Mock data hoặc constants
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility (Zod schema, Tailwind cn)
│   ├── store/           # Zustand global state (useCartStore)
│   ├── types/           # TS Interfaces
│   └── utils/           # Formatters (formatPrice)
├── .env.example
├── next.config.js
└── tailwind.config.ts
```

---

## 3. QUY TẮC BẮT BUỘC KHI VIẾT CODE

### 3.1 Naming Convention (Quy tắc đặt tên)
| Đối tượng | Convention | Ví dụ đúng | Ví dụ sai |
| --- | --- | --- | --- |
| File component FE | `PascalCase.tsx` | `HeroBanner.tsx` | `heroBanner.tsx` |
| Route BE / Folder FE | `kebab-case` | `api/v1/products` | `api/v1/Products` |
| Component function | `PascalCase` | `function ProductCard()` | `function productCard()` |
| BE Controller/Service | `PascalCase` | `ProductController.ts` | `product_controller.ts` |
| Biến môi trường | `SCREAMING_SNAKE`| `DATABASE_URL` | `database_url` |

### 3.2 Quy chuẩn Backend (API)
- **Controller không được chứa Business Logic**: Controller chỉ nhận params/body, gọi Service xử lý, rồi gửi kết quả về. Logic nghiệp vụ (tính toán giá, kiểm tra hàng tồn) nằm ở Service.
- **Data Validation**: 100% Request body/query phải đi qua middleware sử dụng `Zod` trước khi vào Controller.
- **RESTful Pattern**: Endpoint phải sử dụng chuẩn danh từ số nhiều (Ví dụ: `GET /products`, `POST /orders`).
- **Xử lý lỗi tập trung**: Dùng một `errorHandler` middleware ở cuối chuỗi. Không dùng `res.status(500).send()` rải rác.

### 3.3 Quy chuẩn Frontend
- **Hạn chế `use client`**: Giữ mặc định là Server Components. Chỉ thêm `'use client'` ở đỉnh file nếu component có tương tác (`onClick`, `useState`).
- **Tối ưu Hình ảnh**: Bắt buộc dùng thẻ `<Image>` của `next/image` thay vì `<img>` để auto-optimize kích cỡ.
- **Quản lý State Toàn cục**: Các logic phức tạp dùng chung (như Giỏ hàng, User) phải được lưu ở `Zustand` (`src/store/useCartStore.ts`). Không truyền props qua lại quá 2 cấp (prop drilling).

---

## 4. GIT WORKFLOW

- `main` : Chạy production, chỉ Merge, KHÔNG push trực tiếp.
- `develop`: Branch tích hợp, commit test tính năng lên đây trước.
- **Quy tắc tạo Branch**: `feat/[tên-tính-năng]` hoặc `fix/[lỗi-ngắn-gọn]`. (VD: `feat/setup-cart-zustand`).
- **Quy tắc Commit Message**:
  - `feat: [mô tả]` (thêm tính năng mới)
  - `fix: [mô tả]` (sửa lỗi)
  - `chore: [mô tả]` (cập nhật thư viện, setup, linting)
  - `refactor: [mô tả]` (cấu trúc lại code mà không đổi logic)

---

## 5. QA & ĐẢM BẢO CHẤT LƯỢNG

1. **Không còn cảnh báo TypeScript**: `npm run build` ở cả FE và BE phải chạy qua 100% không dính lỗi `any` hay missing type.
2. **Không có Console Error**: Khi F12 trình duyệt, không được có chữ đỏ xuất hiện do React/API lỗi.
3. **Bảo mật**: `DATABASE_URL`, `JWT_SECRET`, và các API Key quan trọng tuyệt đối KHÔNG ĐƯỢC COMMIT vào Github. Luôn tạo bản sao không chứa mã thực tế trong `.env.example`.

> TÀI LIỆU NÀY LÀ BẮT BUỘC TUÂN THỦ TỪ 2026. Mọi hành vi bỏ qua bước kiểm duyệt mã nguồn, thêm thư viện lạ, hoặc vi phạm naming convention sẽ bị yêu cầu làm lại (Reject PR).
