@echo off
title RIKKEI PORTAL AUTOMATION - BANG DIEU KHIEN
color 0A

echo ========================================================
echo     HE THONG TU DONG HOA HOC TAP RIKKEI PORTAL
echo     Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

if not exist "node_modules" (
    echo [Khoi tao] Dang cai dat thu vien lan dau...
    call npm install
    call npx playwright install chromium
)

node run.js

echo.
echo ========================================================
echo [He thong] Phien lam viec ket thuc.
pause
