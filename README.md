# Unified AI Factory (Agentic Software Engineering Platform)

Một nền tảng quản lý và điều phối các AI Agent tự động hóa toàn bộ quy trình thiết kế, phân tích nghiệp vụ, sinh mã nguồn, kiểm thử quy tắc và triển khai phần mềm.

---

## 📌 Tính năng chính (Key Features)

### 1. Command Center (Dashboard)
- Thống kê thời gian thực về các dự án đang chạy, số lượng AI Agent đang hoạt động, công việc chờ phê duyệt và tác vụ đã hoàn thành.
- Thẻ theo dõi **Active Working Agents** và **Active Task Pipelines** hỗ trợ chuyển hướng nhanh đến các bước xử lý tương ứng.

### 2. Quy trình Task Pipeline 7 Bước Tự Động (7-Step Automated Agent Pipeline)
- **Step 1: Check Holly & Requirements** (BA Agent): Kiểm tra tài liệu, hợp lệ hóa file và trích xuất yêu cầu đầu vào.
- **Step 2: Architecture Selection & UI/UX Design** (Architect & Designer Agent): Lựa chọn kiến trúc kỹ thuật (Python/FastAPI...) và thiết kế UI/UX trên Penpot.
- **Step 3: Code & Rules Generation** (Coding Agent): Sinh mã nguồn tự động và áp dụng các quy tắc nghiệp vụ (`BR-09`, PEP8...).
- **Step 4: System Integration & MCP Binding** (Integration Agent & DevOps): Tích hợp các công cụ MCP (Penpot MCP, Postman API, Knowledge Graph DB).
- **Step 5: Validation & Quality Rules Check** (Validate Agent): Đánh giá tự động theo Rule Engine (kiểm tra độ bao phủ và các điều kiện tiền đề).
- **Step 6: Human Review & Security Audit** (Human In The Loop): Đánh giá lỗ hổng bảo mật và phê duyệt từ Kỹ sư trưởng / PO.
- **Step 7: Automated Deployment & Release** (Release Agent): Đóng gói Docker container, chạy kiểm thử tích hợp và triển khai tự động lên môi trường Staging.

### 3. Artifact Storage & Workbench Factory
- Quản lý tất cả sản phẩm đầu ra của Agent (BA Package, Penpot Feature Design, Code Module, Validation Audit Report).
- Workbench tương tác trực tiếp với **Penpot MCP Editor** để chỉnh sửa giao diện real-time.
- Trình điều phối tác vụ (**Task Dispatcher**) cho phép tạo công việc mới và phân công cho từng Agent cụ thể (`BA Agent`, `Designer Agent`, `Validate Agent`).

### 4. Quản lý & Cấu hình Agent (Agent Management)
- Tùy chỉnh vai trò, prompt điều hướng, kỹ năng và kết nối MCP cho từng Agent trong nhà máy phần mềm.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Icons**: Lucide React
- **Utilities**: `clsx`, `tailwind-merge`
- **Formatting**: `oxfmt`

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
- Node.js (phiên bản 18 trở lên)
- npm (hoặc yarn / pnpm)

### 2. Cài đặt Phụ thuộc (Dependencies)
```bash
npm install
```

### 3. Chạy Môi trường Phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:5173`

### 4. Kiểm tra Type Check (TypeScript)
```bash
npx tsc --noEmit
```

### 5. Biển dịch Đóng gói (Production Build)
```bash
npm run build
```

---

## 📁 Cấu trúc Thư mục Dự án (Project Structure)

```
Thực hiện thiết kế/
├── src/
│   ├── components/       # Các UI Component tái sử dụng
│   │   ├── common/       # Badge, Button, Card...
│   │   └── layout/       # Header, Sidebar...
│   ├── config/           # Cấu hình dự án
│   ├── context/          # Context Providers (AuthContext, LanguageContext, ThemeContext)
│   ├── services/         # API Service Clients (Thread Service, Chat Service)
│   ├── utils/            # Utility Helper Functions (cn.ts)
│   ├── views/            # Các trang giao diện chính (DashboardView, TaskPipelineView, WorkspaceView...)
│   ├── App.tsx           # Router & App Shell
│   ├── main.tsx          # React Entrypoint
│   └── index.css         # Style chính & Tailwind v4 rules
├── package.json          # Dependencies & Scripts
├── vite.config.ts        # Cấu hình Vite
└── tsconfig.json         # Cấu hình TypeScript
```