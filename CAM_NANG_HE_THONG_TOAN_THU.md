# CUỐN SÁCH TOÀN THƯ KIẾN TRÚC & VẬN HÀNH
## HỆ THỐNG TỰ ĐỘNG HÓA HỌC TẬP RIKKEI PORTAL
### *Sự kết hợp giữa Playwright Stealth, Local AI Ollama, Vector Store, Persistent Video Lock & Self-Healing Engine*

---

> **Tác giả:** Hệ thống Trợ lý Kỹ thuật & Tự động hóa MIO  
> **Dự án:** Rikkei Bootcamp Workspace (`d:\Rikkei-Bootcamp-Workspace`)  
> **Mục tiêu:** Khóa học *[Tsubasa] Lập trình front-end cơ bản* (Session 17+)  
> **Phiên bản tài liệu:** 3.2.0 (Full Architecture Edition)  
> **Ngày cập nhật:** Tháng 09/2026  

---

## MỤC LỤC TỔNG QUAN

- [LỜI NÓI ĐẦU](#lời-nói-đầu)
- [CHƯƠNG 1: TỔNG QUAN & TRIẾT LÝ THIẾT KẾ](#chương-1-tổng-quan--triết-lý-thiết-kế)
- [CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & LUỒNG ĐIỀU PHỐI](#chương-2-kiến-trúc-hệ-thống--luồng-điều-phối)
- [CHƯƠNG 3: BẢO MẬT, STEALTH & VƯỢT reCAPTCHA V2](#chương-3-bảo-mật-stealth--vượt-recaptcha-v2)
- [CHƯƠNG 4: CƠ CHẾ KHÓA CHẶT THEO DÕI VIDEO (PERSISTENT VIDEO LOCK)](#chương-4-cơ-chế-khóa-chặt-theo-dõi-video-persistent-video-lock)
  - 4.1. Kỹ thuật quét phần tử Video đa tầng (Main Page & Iframe Scanner)
  - 4.2. Vòng lặp Polling 1s và Khóa chặt tiến trình (10 - 30+ phút)
  - 4.3. Hiển thị tiến trình trực quan & Tự động Resume khi mạng gián đoạn
- [CHƯƠNG 5: QUY TRÌNH HỌC SÂU 2 TẦNG DROPDOWN (SESSION -> LESSON -> 3 SUB-ITEMS)](#chương-5-quy-trình-học-sâu-2-tầng-dropdown-session---lesson---3-sub-items)
  - 5.1. Cấu trúc Accordion lồng nhau của Rikkei Portal
  - 5.2. Chuỗi thực thi 3 bước: Video (1.5x) -> Bài đọc -> Smart Quiz 100%
  - 5.3. Giải pháp khắc phục triệt để lỗi Stale Element Reference
- [CHƯƠNG 6: KHO TRI THỨC DẠNG VECTOR PHÂN CẤP (VECTOR KNOWLEDGE STORE)](#chương-6-kho-tri-thức-dạng-vector-phân-cấp-vector-knowledge-store)
- [CHƯƠNG 7: TRỢ LÝ GIẢI QUIZ THÔNG MINH TỰ SỬA SAI ĐẠT 100%](#chương-7-trợ-lý-giải-quiz-thông-minh-tự-sửa-sai-đạt-100)
- [CHƯƠNG 8: HỆ THỐNG TỰ CHẨN ĐOÁN LỖI & TỰ SỬA CHỮA (SELF-HEALING DIAGNOSTIC ENGINE)](#chương-8-hệ-thống-tự-chẩn-đoán-lỗi--tự-sửa-chữa-self-healing-diagnostic-engine)
  - 8.1. Quy trình 4 bước chẩn đoán chuyên sâu
  - 8.2. Chụp ảnh Snapshot màn hình lỗi (`error_diagnosis_log.json` & `snapshots/`)
  - 8.3. Áp dụng phương án sửa lỗi trước khi khởi chạy vòng lặp mới
- [CHƯƠNG 9: QUẢN LÝ TRẠNG THÁI & TIẾP NỐI TIẾN ĐỘ (SMART RESUME)](#chương-9-quản-lý-trạng-thái--tiếp-nối-tiến-độ-smart-resume)
- [CHƯƠNG 10: CẨM NANG VẬN HÀNH & BẢNG MÃ LỖI (TROUBLESHOOTING)](#chương-10-cẩm-nang-vận-hành--bảng-mã-lỗi-troubleshooting)

---

## LỜI NÓI ĐẦU

Cuốn sách này ghi chép lại toàn bộ kiến thức, kiến trúc hệ thống, nguyên lý hoạt động và kỹ thuật triển khai một hệ thống tự động hóa hoàn chỉnh dựa trên **Node.js, Playwright Stealth, Local Ollama AI, Persistent Video Lock, Vector Knowledge Store và Self-Healing Diagnostic Engine** dành cho nền tảng đào tạo Rikkei Portal.

---

## CHƯƠNG 1: TỔNG QUAN & TRIẾT LÝ THIẾT KẾ

### 1.1. Cấu trúc thư mục chuẩn mực
```
d:\Rikkei-Bootcamp-Workspace\
├── CHAY_VONG_LAP_10_LAN_SESSION_20.bat # Launcher vòng lặp 10 lần tự học đến hết Session 20
├── CHAY_1_CLICK_TU_DONG.bat            # Launcher chạy thẳng 1-Click từ A-Z
├── CHAY_HOC_TU_DONG.bat                # Launcher mở Bảng điều khiển Menu
├── CAM_NANG_HE_THONG_TOAN_THU.md       # Cuốn sách toàn thư kiến trúc & vận hành
└── automation/                         # Thư mục mã nguồn chính
    ├── package.json                    # Khai báo thư viện & scripts
    ├── .env                            # File biến môi trường
    ├── run.js                          # Entry point điều phối hệ thống
    ├── storage_state/                  # Nơi lưu trữ trạng thái phiên
    │   ├── auth.json                   # Cookie, Token phiên đăng nhập (Hạn đến 2026)
    │   ├── progress.json               # Lịch sử bài học đã hoàn thành
    │   ├── iteration_analysis.json     # Báo cáo phân tích từng chu kỳ
    │   ├── error_diagnosis_log.json    # Nhật ký tự chẩn đoán lỗi
    │   └── snapshots/                  # Thư mục ảnh chụp màn hình khi có lỗi
    ├── knowledge_base/                 # KHO TRI THỨC DẠNG VECTOR & BỘ NHỚ KỸ NĂNG
    │   ├── learned_skills_memory.json  # BỘ NHỚ 10 KỸ NĂNG DO NGƯỜI DÙNG HUẤN LUYỆN
    │   └── curriculum_vector_store.json # Dữ liệu phân cấp Module -> Session -> Lesson
    ├── notes/                          # Thư mục ghi chú bài học do AI sinh ra
    └── src/                            # Các module nghiệp vụ
        ├── config.js                   # Quản lý cấu hình tập trung
        ├── browser.js                  # Khởi tạo Playwright Stealth & dọn dẹp process
        ├── auth.js                     # Logic đăng nhập, Material UI & reCAPTCHA
        ├── navigator.js                # Điều hướng Portal & chọn khóa học
        ├── rules.js                    # Khóa chặt theo dõi Video, đọc bài & Vector Store
        ├── learner.js                  # Quét sâu 2 tầng dropdown và thực thi tuần tự 3 mục con
        ├── vector_store.js             # Module quản lý kho tri thức vector phân cấp
        ├── quiz_solver.js              # Module giải Quiz tự sửa sai đạt 100%
        ├── error_healer.js             # Module tự chẩn đoán lỗi & tự sửa chữa
        ├── skill_memory.js             # Module quản lý nạp 10 kỹ năng hệ thống
        ├── test_skills_engine.js       # Script tự kiểm tra 5 bài test kỹ năng
        ├── autonomous_loop.js          # Động cơ vòng lặp 10 lần tự phục hồi
        ├── progress_tracker.js         # Quản lý lịch sử và Smart Resume
        └── menu.js                     # Giao diện CLI Bảng điều khiển tương tác
```

### 1.2. Bảng Danh Mục 10 Kỹ Năng Cốt Lõi Hệ Thống Đã Ghi Nhớ

| Mã Skill | Tên Kỹ Năng | Nhóm Nghiệp Vụ | Nguồn Gốc Huấn Luyện |
|---|---|---|---|
| **SKILL-001** | `RIGHT_PANEL_DEEP_SCROLL` | Điều hướng DOM | User dạy: Kéo thanh trượt danh mục bên phải xuống từng nấc (15 nấc x 400px) |
| **SKILL-002** | `SUB_ITEM_ACCORDION_DROPDOWN` | Tương tác DOM | User dạy: Click mở hàng bài học để bung 3 mục con Video/Đọc/Quiz |
| **SKILL-003** | `SUB_ITEM_CHECKMARK_DETECTION` | Tối ưu hóa Luồng | User dạy: Nhận diện tích xanh con để nhảy thẳng vào mục chưa làm |
| **SKILL-004** | `PERSISTENT_VIDEO_LOCK` | Xử lý Video | User dạy: Khóa chặt tiến trình xem video 10-30+ phút, không click thoát ra ngoài |
| **SKILL-005** | `SMART_QUIZ_2_PASS_100` | Trí tuệ AI | User dạy: Giải 2 lượt tự sửa sai từ modal xem câu sai đạt 100% |
| **SKILL-006** | `RECAPTCHA_HUMAN_IN_THE_LOOP` | Vượt Bảo Mật | User dạy: Giữ cửa sổ khi gặp câu đố 3x3 và tự động tiếp quản khi có tích xanh |
| **SKILL-007** | `VECTOR_KNOWLEDGE_EXTRACTION` | Quản lý Tri Thức | Kiến trúc: Lưu trữ dữ liệu phân cấp vào `curriculum_vector_store.json` |
| **SKILL-008** | `SELF_HEALING_DIAGNOSTIC` | Tự Phục Hồi | User dạy: Chụp snapshot lỗi, phân tích nguyên nhân gốc trước khi restart |
| **SKILL-009** | `PERSISTENT_SESSION_TOKEN_GUARD`| Xác Thực | Kiến trúc: Duy trì phiên đăng nhập dài hạn qua `auth.json` đến 2026 |
| **SKILL-010** | `AUTONOMOUS_10_ITERATION_ENGINE`| Điều phối Vòng lặp | User dạy: Vòng lặp 10 chu kỳ kiên định quét đến hết Session 20 |

---

## CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & LUỒNG ĐIỀU PHỐI

```
+-------------------------------------------------------------------------+
|                  ĐỘNG CƠ VÒNG LẶP TỰ HỌC 10 LẦN                         |
|             [CHAY_VONG_LAP_10_LAN_SESSION_20.bat]                       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                PLAYWRIGHT STEALTH + PERSISTENT SESSION                  |
|  - Khởi động Chromium ẩn danh, nạp cookie từ auth.json                  |
|  - Vào https://portal.rikkei.edu.vn/learn/32                           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|           ĐIỀU HƯỚNG SÂU 2 TẦNG ACCORDION (SESSION 17 - 20)             |
|  - Bấm mở tiêu đề Session 17 -> Bung danh sách Lesson                  |
|  - Bấm mở hàng Lesson 10 -> Bung 3 mục con:                            |
|    [1] 🎬 Video bài giảng (Khóa chặt theo dõi 100%, 1.5x)               |
|    [2] 📄 Bài đọc lý thuyết (Cuộn trang & Lưu Vector Store)             |
|    [3] 📝 Bài tập trắc nghiệm (Smart Quiz Solver đạt 100%)              |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|             BỘ TỰ CHẨN ĐOÁN LỖI & SỬA CHỮA (SELF-HEALING)               |
|  - Bắt lỗi -> Chụp snapshot ảnh -> Phân tích nguyên nhân gốc            |
|  - Ghi error_diagnosis_log.json -> Áp dụng phương án sửa cho vòng sau   |
+-------------------------------------------------------------------------+
```

---

## CHƯƠNG 3: BẢO MẬT, STEALTH & VƯỢT reCAPTCHA V2

- **Ẩn dấu vân tay tự động hóa:** `puppeteer-extra-plugin-stealth` loại bỏ cờ `navigator.webdriver`.
- **Bảo tồn token dài hạn:** File `auth.json` lưu giữ `access_token` có hiệu lực đến ngày **24/09/2026**.
- **Human-in-the-loop Auto Takeover:** Khi phát hiện câu đố ảnh reCAPTCHA 3x3, bot giữ nguyên cửa sổ để người học xác minh, và lập tức tự động tiếp quản quyền điều khiển ngay khi có dấu tích xanh.

---

## CHƯƠNG 4: CƠ CHẾ KHÓA CHẶT THEO DÕI VIDEO (PERSISTENT VIDEO LOCK)

### 4.1. Kỹ thuật quét phần tử Video đa tầng
Hàm `findActiveVideo(page)` trong `src/rules.js` quét sâu qua cả trang chính và tất cả các `iframe` con để bắt trúng thẻ `<video>`.

### 4.2. Vòng lặp Polling 1s và Khóa chặt tiến trình (10 - 30+ phút)
- Bot thiết lập vòng lặp theo dõi chu kỳ 1 giây/lần với giới hạn lên tới 7200 giây (2 tiếng).
- **Trong suốt thời gian video đang phát, bot tuyệt đối không click bất kỳ nút nào khác và không rời trang.**
- Tự động Resume video nếu phát hiện bị tạm dừng do mạng gián đoạn.

### 4.3. Hiển thị tiến trình trực quan
Console cập nhật liên tục:  
`[Video Tracker] ⏳ TIẾN ĐỘ: 05:30 / 18:45 (29%) - Đang phát [1.5x]...`  
Ngay khi đạt $100\%$ (`ended === true`), bot đệm 4 giây an toàn rồi tự động chuyển tiếp sang **Bước 2: Bài đọc**.

---

## CHƯƠNG 5: QUY TRÌNH HỌC SÂU 2 TẦNG DROPDOWN (SESSION -> LESSON -> 3 SUB-ITEMS)

### 5.1. Cấu trúc Accordion lồng nhau của Rikkei Portal
Một Lesson trên web chỉ được đánh dấu `✓ Đã hoàn thành` khi người học hoàn thành **đủ cả 3 mục con**:

```text
Session 17: DOM & Event - LÝ THUYẾT (Accordion Cấp 1)
  └── Lesson 10: Gắn sự kiện (Accordion Cấp 2 - Phải Click Bung Dropdown)
        ├── [1] 🎬 Video bài giảng (Cần xem hết 100%)
        ├── [2] 📄 Bài đọc lý thuyết (Cần cuộn đọc)
        └── [3] 📝 Bài tập trắc nghiệm (Cần đạt điểm 100%)
```

### 5.2. Chuỗi thực thi 3 bước
1. **Bước 1 (Video):** Click mở Video $\rightarrow$ Chờ phát hết $100\%$ ($1.5\times$) $\rightarrow$ Bấm hoàn thành.
2. **Bước 2 (Bài đọc):** Mở lại Lesson $\rightarrow$ Bấm mục Bài đọc $\rightarrow$ Cuộn trang $\rightarrow$ Trích xuất nội dung vào **Vector Store**.
3. **Bước 3 (Quiz):** Mở lại Lesson $\rightarrow$ Bấm Bài tập $\rightarrow$ Kích hoạt **Smart Quiz Solver** giải 2 lượt tự sửa sai để đạt điểm tối đa $100\%$!
4. **Xác nhận:** Huy hiệu Lesson 10 chuyển sang `✓ Đã hoàn thành` $\rightarrow$ Tự động chuyển tiếp sang Lesson 11, 12 và các Session tiếp theo!

### 5.3. Giải pháp khắc phục triệt để lỗi Stale Element Reference
Hệ thống sử dụng cơ chế **Dynamic Re-Query**: Sau mỗi lần chuyển trang hoàn thành 1 mục con, bot truy vấn lại DOM tươi mới trước khi click mục con tiếp theo, loại bỏ hoàn toàn nguy cơ bị văng lỗi mất phần tử.

---

## CHƯƠNG 6: KHO TRI THỨC DẠNG VECTOR PHÂN CẤP (VECTOR KNOWLEDGE STORE)

Tất cả nội dung bài học được lưu có cấu trúc tại [`automation/knowledge_base/curriculum_vector_store.json`](file:///d:/Rikkei-Bootcamp-Workspace/automation/knowledge_base/curriculum_vector_store.json):

```json
{
  "id": "module_1_frontend_session_17_lesson_10",
  "module": "Module 1 - Frontend",
  "session": "Session 17: Hệ thống kiến thức DOM & Event",
  "lesson": "Lesson 10: Gắn sự kiện cho các phần tử HTML",
  "title": "Lesson 10: Gắn sự kiện cho các phần tử HTML (Inline, on và addEventListener)",
  "url": "https://portal.rikkei.edu.vn/learn/32/document/599",
  "contentType": "reading",
  "rawContent": "Toàn bộ nội dung lý thuyết bài học...",
  "summary": "Tóm tắt từ Ollama AI...",
  "savedAt": "2026-09-04T07:00:00.000Z"
}
```

---

## CHƯƠNG 7: TRỢ LÝ GIẢI QUIZ THÔNG MINH TỰ SỬA SAI ĐẠT 100%

Quy trình giải bài tập trắc nghiệm gồm **2 lượt tự động (2-Pass Self-Correction)**:
- **Lượt 1:** AI Ollama suy luận và nộp bài.
- **Nếu chưa đạt 100%:** Bot tự động click nút "Xem các câu mình sai" $\rightarrow$ Học toàn bộ danh sách đáp án đúng $\rightarrow$ Bấm "Làm lại bài kiểm tra".
- **Lượt 2:** Áp dụng $100\%$ các đáp án chính xác vừa học $\rightarrow$ **Đạt điểm tuyệt đối 100%!**

---

## CHƯƠNG 8: HỆ THỐNG TỰ CHẨN ĐOÁN LỖI & TỰ SỬA CHỮA (SELF-HEALING DIAGNOSTIC ENGINE)

### 8.1. Quy trình 4 bước chẩn đoán chuyên sâu
Khi một vòng lặp gặp sự cố, module [`src/error_healer.js`](file:///d:/Rikkei-Bootcamp-Workspace/automation/src/error_healer.js) được kích hoạt ngay:
1. **Chụp ảnh Snapshot:** Lưu ảnh màn hình lỗi vào `automation/storage_state/snapshots/error_iter_X.png`.
2. **Phân loại lỗi:** Nhận diện nguyên nhân (`DOM_STALE_ELEMENT`, `SELECTOR_TIMEOUT`, `AUTH_CAPTCHA_REQUIRED`, `NETWORK_INSTABILITY`).
3. **Đưa ra phương án sửa chữa:** Tự động điều chỉnh thời gian delay, làm mới trạng thái DOM hoặc dọn dẹp Chromium Zombie.
4. **Lưu nhật ký:** Ghi chẩn đoán vào [`storage_state/error_diagnosis_log.json`](file:///d:/Rikkei-Bootcamp-Workspace/automation/storage_state/error_diagnosis_log.json) và đệm 5 giây phục hồi trước khi mở vòng lặp tiếp theo.

---

## CHƯƠNG 9: QUẢN LÝ TRẠNG THÁI & TIẾP NỐI TIẾN ĐỘ (SMART RESUME)

- Lưu tiến độ học tập vào [`automation/storage_state/progress.json`](file:///d:/Rikkei-Bootcamp-Workspace/automation/storage_state/progress.json).
- Lưu báo cáo phân tích chu kỳ vào [`automation/storage_state/iteration_analysis.json`](file:///d:/Rikkei-Bootcamp-Workspace/automation/storage_state/iteration_analysis.json).

---

## CHƯƠNG 10: CẨM NANG VẬN HÀNH & BẢNG MÃ LỖI (TROUBLESHOOTING)

### 10.1. Hướng dẫn khởi chạy nhanh
* **Cách khuyên dùng (Vòng lặp 10 lần tự học đến hết Session 20):**  
  Nhấp đúp chuột vào: **[`CHAY_VONG_LAP_10_LAN_SESSION_20.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_VONG_LAP_10_LAN_SESSION_20.bat)**
* **Cách chạy 1-Click thông thường:**  
  Nhấp đúp chuột vào: **[`CHAY_1_CLICK_TU_DONG.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_1_CLICK_TU_DONG.bat)**

### 10.2. Bảng mã lỗi và biện pháp xử lý tự động

| Mã lỗi | Nguyên nhân | Biện pháp tự động xử lý |
|---|---|---|
| `DOM_STALE_ELEMENT` | Phần tử bị tải lại khi chuyển trang | Tự động kích hoạt Dynamic Re-query truy vấn lại phần tử mới |
| `VIDEO_STALL` | Video bị đứng do mạng lag | Tự động gọi lệnh Resume sau mỗi 1s |
| `AUTH_CAPTCHA_REQUIRED` | Google yêu cầu giải câu đố ảnh | Giữ cửa sổ để người học xác minh, tự động tiếp quản tức thì sau đó |
| `NETWORK_INSTABILITY` | Mạng giật hoặc server Portal chậm | Tự động đệm 5s và tải lại trang khóa học |

---

## TỔNG KẾT

Hệ thống tự động hóa học tập Rikkei Portal phiên bản 3.2 Master Edition là một kiệt tác tự động hóa toàn diện, bền bỉ và tự thích ứng cao. Việc kết hợp chặt chẽ giữa **Persistent Video Lock**, **Quy trình học sâu 3 mục con**, **Vector Store**, **Smart Quiz Solver 100%** và **Self-Healing Diagnostic Engine** mang đến sự an tâm tuyệt đối cho người học trong suốt quá trình hoàn thành khóa học!
