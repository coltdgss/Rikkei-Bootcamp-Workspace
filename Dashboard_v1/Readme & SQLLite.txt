SQL Lite Python : 
python -m http.server 8000 --directory "D:\Rikkei-Bootcamp-Workspace\Rikkei-Bootcamp-Workspace\Dashboard_v1"


Ollama :

Đầu dòng 2: Mở cửa sổ PowerShell

Nhấn tổ hợp phím Windows + S trên bàn phím.
Gõ chữ powershell.
Nhấp chuột phải vào Windows PowerShell -> Chọn Run as Administrator (Chạy với quyền quản trị viên).
Đầu dòng 3: Dán và chạy lệnh cấp quyền CORS cho Ollama

Copy chính xác lệnh sau:
powershell


[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')
Nhấp chuột phải vào màn hình xanh PowerShell để dán lệnh vào -> Nhấn Enter.
(Lệnh này sẽ thiết lập cấu hình vĩnh viễn cho Windows: cho phép mọi ứng dụng web gọi đến Ollama).
Đầu dòng 4: Khởi động lại Ollama

Nhấn phím Windows trên bàn phím.
Gõ Ollama -> Nhấn Enter để mở lại ứng dụng Ollama.
Đầu dòng 5: Kiểm tra kết quả

Mở trình duyệt vào http://localhost:8000/index.html.
Tại Mục 6 - Local Ollama AI Review, bấm nút [Kiểm tra Ollama].
Đèn trạng thái sẽ lập tức chuyển sang màu xanh: Ollama: online và nhận diện được các model có sẵn trong máy bạn.