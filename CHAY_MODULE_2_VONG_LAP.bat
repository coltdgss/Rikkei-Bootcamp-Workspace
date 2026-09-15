@echo off
title RIKKEI PORTAL - MODULE 2 (VONG LAP AUTO)
color 0B

echo ========================================================
echo     RIKKEI PORTAL AUTOMATION - MODULE 2 (VONG LAP)
echo     Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

echo [He thong] Dang khoi dong dong co vong lap Module 2...
echo.
node src/autonomous_loop_module2.js

echo.
echo ========================================================
echo [He thong] Da hoan tat tien trinh vong lap Module 2.
pause
