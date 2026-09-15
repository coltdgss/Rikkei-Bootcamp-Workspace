# Hướng Dẫn Chuyển Đổi Môi Trường Làm Việc (Migration Guide) sang Máy Tính Mới

Tài liệu này hướng dẫn chi tiết cách để bạn có thể mang toàn bộ không gian làm việc **Rikkei-Bootcamp-Workspace (RBW)**, các tiện ích, phím tắt, và cấu hình AI hiện tại sang một máy tính mới mà **không bị mất bất kỳ dữ liệu hay tính năng nào**.

Tài liệu được chia thành 4 giai đoạn logic để đảm bảo bạn không bỏ sót bất kỳ cấu hình nào.

---

## Giai đoạn 1: Đồng bộ cấu hình VS Code (Thực hiện trên máy CŨ)

**Mục đích:** Đưa toàn bộ các Extension (như Live Server, công cụ AI), phím tắt (Shortcuts), giao diện (Theme) và cài đặt cá nhân của VS Code lên Đám mây (Cloud) để máy mới có thể tải về tự động.

**Cách thực hiện:**
1. Mở **VS Code** trên máy hiện tại.
2. Nhìn xuống **góc dưới cùng bên trái**, nhấp vào biểu tượng **Bánh răng (Settings) ⚙️**.
3. Chọn **Turn on Settings Sync...** (Bật Đồng bộ hóa cài đặt).
4. Một cửa sổ hiện ra, hãy đảm bảo đánh dấu tích (✓) vào tất cả các mục: `Settings`, `Keyboard Shortcuts`, `User Snippets`, `Extensions`, `UI State`.
5. Nhấp vào nút **Sign in & Turn on** và chọn đăng nhập bằng tài khoản **GitHub** hoặc **Microsoft** của bạn. 
6. Chờ vài phút để VS Code đẩy toàn bộ cấu hình của bạn lên tài khoản này.

> [!TIP]
> Việc này giúp bạn không phải nhớ mình đã từng cài những Extension nào. Sang máy mới, nó sẽ tự động tải lại chính xác y hệt.

---

## Giai đoạn 2: Sao lưu mã nguồn RBW (Thực hiện trên máy CŨ)

**Mục đích:** Mang toàn bộ thư mục `D:\Rikkei-Bootcamp-Workspace` sang máy mới. Thư mục này đang chứa code của bạn, các file quy tắc (`VSCODE_CODING_DIRECTIVES.md`), và các phím tắt chuyên nghiệp bạn đã cấu hình.

**Cách thực hiện (Chọn 1 trong 2 cách):**

* **Cách A (Thủ công - Dễ nhất):** Cắm USB hoặc Ổ cứng di động vào. Copy nguyên thư mục `D:\Rikkei-Bootcamp-Workspace` từ máy tính vào USB.
* **Cách B (Khuyên dùng - Dùng Git):** 
  1. Mở Terminal trong VS Code, đảm bảo bạn đã commit toàn bộ code mới nhất lên Github.
  2. Dùng lệnh `git push` để đẩy toàn bộ code lên repository lưu trữ của bạn.

---

## Giai đoạn 3: Sao chép dữ liệu AI (Ollama) (Thực hiện trên máy CŨ)

**Mục đích:** Hệ thống của bạn đang được thiết lập để lưu các bộ não AI (Ollama models) ở thư mục `D:\98_OllamaModels` để tiết kiệm ổ C. Nếu không muốn phải tải lại các file AI rất nặng ở máy mới, bạn cần copy thư mục này.

**Cách thực hiện:**
1. Mở File Explorer, tìm đến thư mục `D:\98_OllamaModels`.
2. Copy thư mục này vào chung USB/Ổ cứng ngoài ở Giai đoạn 2.

> [!WARNING]
> Thư mục này thường khá nặng (vài GB đến chục GB tùy số lượng model). Nếu máy tính mới có mạng internet rất mạnh, bạn có thể bỏ qua bước này và cài đặt lại từ đầu ở Giai đoạn 4.

---

## Giai đoạn 4: Phục hồi và Cài đặt (Thực hiện trên máy MỚI)

Bây giờ bạn đã sang máy tính mới. Hãy làm theo đúng thứ tự sau:

### Bước 4.1: Cài đặt VS Code và Phục hồi cấu hình
1. Tải và cài đặt **Visual Studio Code** từ trang chủ.
2. Mở VS Code lên, bấm vào biểu tượng **Bánh răng (Settings) ⚙️** ở góc dưới bên trái.
3. Chọn **Turn on Settings Sync...**, đăng nhập vào đúng tài khoản GitHub/Microsoft bạn đã dùng ở Giai đoạn 1.
4. VS Code sẽ tự động chạy ngầm và cài lại toàn bộ Extension, phím tắt, giao diện cho bạn. (Sẽ mất khoảng 2-5 phút).

### Bước 4.2: Đưa mã nguồn RBW vào máy mới
1. Cắm USB vào máy mới.
2. Bạn **nên** tạo lại ổ D: (hoặc một ổ đĩa tương tự) trên máy mới.
3. Copy thư mục `Rikkei-Bootcamp-Workspace` từ USB và dán thẳng vào ổ đĩa trên máy mới để đường dẫn giống cũ (ví dụ: `D:\Rikkei-Bootcamp-Workspace`).
4. Trong VS Code, chọn `File` > `Open Folder...` và trỏ tới thư mục vừa copy.

### Bước 4.3: Cài đặt lại môi trường AI (Ollama)
Vì bạn đang sử dụng môi trường AI cục bộ tích hợp sâu với Workspace:
1. Copy thư mục `98_OllamaModels` từ USB vào ổ `D:\` của máy mới.
2. Lên trang chủ tải phần mềm **Ollama** và cài đặt bình thường.
3. **Cài đặt lại Biến môi trường (Environment Variable)** để Ollama nhận diện ổ D:
   - Nhấn phím **Windows**, gõ `Environment Variables` và chọn *Edit the system environment variables*.
   - Nhấn nút **Environment Variables...**
   - Ở phần *User variables*, bấm **New...**
   - Variable name điền: `OLLAMA_MODELS`
   - Variable value điền: `D:\98_OllamaModels`
   - Nhấn OK để lưu lại.
4. Khởi động lại máy tính mới (Restart) để biến môi trường có tác dụng.

---

## 🎉 Hoàn tất

Sau khi khởi động lại, bạn mở VS Code lên. Lúc này:
- Mọi Extension như Live Server, AI Assistant đã sẵn sàng.
- Các file quy tắc, phím tắt (như `/rikkeicomment`) vẫn nằm nguyên trong thư mục dự án và hoạt động bình thường.
- Code của bạn ở trạng thái mới nhất y hệt lúc bạn rời máy cũ.
- Bấm Go Live là Dashboard sẽ chạy lên.
