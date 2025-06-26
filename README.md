# HIVApp: Nền tảng Blog

Đây là một ứng dụng blog full-stack được xây dựng bằng React.js cho frontend và Spring Boot cho backend.

## Tổng quan

HIVApp là một nền tảng blog cho phép người dùng tạo, xuất bản và quản lý các bài đăng trên blog. Nó cũng bao gồm các tính năng như xác thực người dùng, nhận xét và lượt thích.

## Công nghệ sử dụng

### Frontend

*   **React.js:** Thư viện JavaScript để xây dựng giao diện người dùng.
*   **Vite:** Công cụ xây dựng để phát triển frontend nhanh chóng.
*   **React Router:** Để định tuyến phía máy khách.
*   **Tailwind CSS:** Framework CSS ưu tiên tiện ích để tạo kiểu.
*   **Axios:** Trình khách HTTP dựa trên Promise để thực hiện các yêu cầu API.
*   **Editor.js:** Trình chỉnh sửa kiểu khối cho các bài đăng trên blog.

### Backend

*   **Spring Boot:** Framework dựa trên Java để xây dựng các ứng dụng RESTful API.
*   **Spring Security:** Để xác thực và ủy quyền người dùng.
*   **Spring Data JPA:** Để tương tác với cơ sở dữ liệu.
*   **MySQL:** Hệ quản trị cơ sở dữ liệu quan hệ.
*   **Maven:** Công cụ quản lý và xây dựng dự án.

## Tính năng

*   **Xác thực người dùng:** Đăng ký và đăng nhập bằng email và mật khẩu hoặc thông qua Google OAuth2.
*   **Tạo và quản lý blog:** Người dùng có thể tạo, chỉnh sửa và xóa các bài đăng trên blog của mình.
*   **Trình chỉnh sửa văn bản đa dạng thức:** Sử dụng Editor.js để có trải nghiệm viết phong phú.
*   **Tương tác với blog:** Người dùng có thể thích và bình luận về các bài đăng trên blog.
*   **Hồ sơ người dùng:** Xem và chỉnh sửa thông tin hồ sơ người dùng.
*   **Tìm kiếm:** Tìm kiếm các bài đăng trên blog.

## Bắt đầu

### Điều kiện tiên quyết

*   Node.js và npm (hoặc yarn)
*   Java Development Kit (JDK)
*   MySQL

### Cài đặt

1.  **Clone a repository:**

    ```bash
    git clone https://github.com/your-username/HIVApp.git
    cd HIVApp
    ```

2.  **Cài đặt Frontend:**

    ```bash
    npm install
    ```

3.  **Cài đặt Backend:**

    *   Mở dự án backend trong IDE ưa thích của bạn (ví dụ: IntelliJ IDEA, Eclipse).
    *   Cập nhật cấu hình cơ sở dữ liệu trong `application.properties`.
    *   Chạy ứng dụng Spring Boot.

### Chạy ứng dụng

1.  **Chạy Frontend:**

    ```bash
    npm run dev
    ```

2.  **Chạy Backend:**

    *   Chạy ứng dụng Spring Boot từ IDE của bạn.

Ứng dụng frontend sẽ có sẵn tại `http://localhost:5173` và máy chủ backend sẽ chạy trên cổng được định cấu hình (mặc định là 8080).

## Cấu trúc dự án

```
HIVApp/
├── courseuth/         # Backend Spring Boot
│   └── ...
├── public/              # Tài sản tĩnh cho frontend
├── src/                 # Mã nguồn Frontend React
│   ├── assets/          # Hình ảnh và các tài sản khác
│   ├── components/      # Các thành phần React có thể tái sử dụng
│   ├── pages/           # Các thành phần trang
│   ├── App.jsx          # Thành phần ứng dụng gốc
│   └── main.jsx         # Điểm vào cho ứng dụng React
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```