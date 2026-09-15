@echo off
title RIKKEI PORTAL - VONG LAP 10 LAN TU HOC HET SESSION 20
color 0B

echo ========================================================
echo   VONG LAP TU DONG 10 LAN - MUC TIEU: HOC HET SESSION 20
echo   Hoc vien: Nguyen Van Trung (TSU K01 - 159)
echo ========================================================
echo.

cd /d "%~dp0automation"

echo [He thong] Dang khoi dong dong co vong lap 10 lan...
echo.
node src/autonomous_loop.js

echo.
echo ========================================================
echo [He thong] Da hoan tat tien trinh vong lap 10 lan.
pause
