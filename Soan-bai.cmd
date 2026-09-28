@echo off
rem Mo trang Soan bai tren may tinh. Dong cua so nay de tat.
cd /d "%~dp0"
chcp 65001 >nul
set SITE_URL=https://lop2.hoandat.com
call pnpm soan
pause
