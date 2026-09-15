@echo off
title RIKKEI PORTAL - CHE DO QUAN SAT & HOC HOI (AI OBSERVER)
color 0E

echo ========================================================
echo   CHE DO QUAN SAT & HOC HOI HANH VI NGUOI DUNG (AI OBSERVER)
echo   Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

echo [He thong] Dang bat trinh duyet truc quan tren man hinh...
echo.
node src/observer.js

echo.
echo ========================================================
echo [He thong] Da luu xong du lieu quan sat va Cookie moi nhat.
pause
