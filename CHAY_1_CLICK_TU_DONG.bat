@echo off
title RIKKEI PORTAL - 1-CLICK FULL AUTO PILOT
color 0B

echo ========================================================
echo     RIKKEI PORTAL AUTOMATION - 1-CLICK FULL AUTO PILOT
echo     Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

if not exist "node_modules" (
    echo [Khoi tao] Dang cai dat thu vien lan dau...
    call npm install
    call npx playwright install chromium
)

node run.js --full-auto

echo.
echo ========================================================
echo [He thong] Da hoan tat tien trinh.
pause
