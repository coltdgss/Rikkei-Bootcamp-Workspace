@echo off
title RIKKEI PORTAL - MODULE 2 (1-CLICK AUTO)
color 0A

echo ========================================================
echo     RIKKEI PORTAL AUTOMATION - MODULE 2 (1-CLICK)
echo     Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

if not exist "node_modules" (
    echo [Khoi tao] Dang cai dat thu vien lan dau...
    call npm install
    call npx playwright install chromium
)

node src/run_module2.js --full-auto

echo.
echo ========================================================
echo [He thong] Da hoan tat tien trinh Module 2.
pause
