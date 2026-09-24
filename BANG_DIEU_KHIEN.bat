@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title RIKKEI BOOTCAMP WORKSPACE - BẢNG ĐIỀU KHIỂN TRUNG TÂM
cd /d "%~dp0"

:MENU
cls
echo ======================================================================
echo       🎓 RIKKEI BOOTCAMP WORKSPACE - BẢNG ĐIỀU KHIỂN TRUNG TÂM 🎓
echo          Học viên: Nguyễn Văn Trung  ^|  Hệ thống học tập tự động
echo ======================================================================
echo.
echo   [1] Khởi động Dashboard v1 Web Server (Port 8000 + Mở trình duyệt)
echo   [2] ⚡ Đồng bộ dữ liệu từ RK-MODULE2-DATABASE (Google Drive)
echo   [3] Kiểm tra trạng thái AI Review (Local Ollama qwen2.5-coder)
echo   [4] Quét và đồng bộ Menu bài tập HTML (System Menu Scanner)
echo   [5] Đồng bộ tiến độ lên GitHub (Git Commit ^& Push)
echo   [6] Mở nhanh thư mục dự án (SQL_DATA, Dashboard v1, Google Drive)
echo   [0] Thoát
echo.
echo ======================================================================
set /p choice="👉 Nhập lựa chọn của bạn (0-6): "

if "%choice%"=="1" goto START_SERVER
if "%choice%"=="2" goto SYNC_DATABASE
if "%choice%"=="3" goto CHECK_OLLAMA
if "%choice%"=="4" goto RUN_SCANNER
if "%choice%"=="5" goto GIT_SYNC
if "%choice%"=="6" goto OPEN_FOLDERS
if "%choice%"=="0" goto EXIT_APP

echo.
echo ❌ Lựa chọn không hợp lệ. Vui lòng nhập từ 0 đến 6.
timeout /t 2 >nul
goto MENU

:START_SERVER
cls
echo ======================================================================
echo   ĐANG KHỞI ĐỘNG INTELLIGENT DASHBOARD SERVER (PORT 8000)...
echo ======================================================================
echo.
echo Máy chủ hỗ trợ đầy đủ API Đồng bộ dữ liệu 1-Click trên giao diện web.
echo Đang tự động mở trình duyệt tới: http://localhost:8000/Dashboard_v1/index.html
echo.
echo (Nhấn Ctrl + C để dừng máy chủ khi hoàn thành học tập)
echo ----------------------------------------------------------------------
python scripts\server.py 8000
pause
goto MENU

:SYNC_DATABASE
cls
echo ======================================================================
echo   ⚡ ĐANG ĐỒNG BỘ DỮ LIỆU TỪ GOOGLE DRIVE (RK-MODULE2-DATABASE)...
echo ======================================================================
echo.
python scripts\sync_database.py
echo.
echo ======================================================================
echo [Hoàn tất] Dữ liệu Session tương ứng đã được trích xuất và đồng bộ!
echo.
pause
goto MENU

:CHECK_OLLAMA
cls
echo ======================================================================
echo   KIỂM TRA TRẠNG THÁI LOCAL AI ENGINE (OLLAMA)
echo ======================================================================
echo.
python -c "import urllib.request, json; sys=__import__('sys'); sys.stdout.reconfigure(encoding='utf-8');
try:
    with urllib.request.urlopen('http://127.0.0.1:11434/api/tags', timeout=3) as r:
        d = json.loads(r.read().decode('utf-8'))
        models = [m.get('name') for m in d.get('models', [])]
        print('✅ Ollama Status: ONLINE (Port 11434)');
        print('📦 Danh sách Models đã cài đặt:', ', '.join(models) if models else 'Chưa có model nào');
        if any('qwen2.5-coder' in m for m in models):
            print('🎯 Model qwen2.5-coder: SẴN SÀNG CHẤM ĐIỂM VÀ ĐÁNH GIÁ SQL!');
        else:
            print('⚠️ Khuyến nghị cài đặt model qwen2.5-coder:7b bằng lệnh: ollama run qwen2.5-coder:7b');
except Exception as e:
    print('❌ Ollama Status: OFFLINE (Chưa bật ứng dụng Ollama)');
    print('   Gợi ý: Hãy mở ứng dụng Ollama trên máy tính hoặc chạy file start_ollama.bat');
"
echo.
pause
goto MENU

:RUN_SCANNER
cls
echo ======================================================================
echo   QUÉT VÀ ĐỒNG BỘ CÂY MENU BÀI TẬP HTML (SYSTEM MENU SCANNER)
echo ======================================================================
echo.
python scripts\system_menu.py
pause
goto MENU

:GIT_SYNC
cls
echo ======================================================================
echo   ĐỒNG BỘ TIẾN ĐỘ LÊN GITHUB REPOSITORY
echo ======================================================================
echo.
git status
echo.
set /p confirm="Bạn có muốn commit và push toàn bộ tiến độ lên GitHub? (Y/N): "
if /i "%confirm%"=="Y" (
    git add .
    git commit -m "Auto sync workspace progress: Module 2 Database & Dashboard v1"
    git push origin main
    echo.
    echo ✅ Đã đẩy tiến độ lên GitHub thành công!
) else (
    echo Đã hủy thao tác đồng bộ Git.
)
echo.
pause
goto MENU

:OPEN_FOLDERS
cls
echo ======================================================================
echo   MỞ NHANH THƯ MỤC LÀM VIỆC TRONG WINDOWS EXPLORER
echo ======================================================================
echo.
echo   [1] Mở thư mục SQL_DATA (Chứa các file .sql bài tập Module 2)
echo   [2] Mở thư mục Dashboard_v1 (Giao diện học tập trực quan)
echo   [3] Mở thư mục Google Drive (Chứa file RK-MODULE2-DATABASE gốc)
echo   [4] Mở thư mục gốc Workspace
echo   [0] Quay lại Menu chính
echo.
set /p fchoice="👉 Chọn thư mục muốn mở (0-4): "

if "%fchoice%"=="1" start "" "%~dp0Module_2_Database\SQL_DATA" & goto MENU
if "%fchoice%"=="2" start "" "%~dp0Dashboard_v1" & goto MENU
if "%fchoice%"=="3" start "" "D:\DRIVER\My Drive\9_DU_AN_CA_NHAN\3. IT - AI APP\1. HỌC IT\MODULE_2" & goto MENU
if "%fchoice%"=="4" start "" "%~dp0" & goto MENU
goto MENU

:EXIT_APP
cls
echo Cảm ơn bạn đã sử dụng Bảng Điều Khiển Rikkei Bootcamp Workspace. Chúc bạn học tập tốt!
timeout /t 2 >nul
exit /b 0
