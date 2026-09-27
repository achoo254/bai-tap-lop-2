@echo off
rem Mo trang Soan bai tren may tinh. Dong cua so nay de tat.
cd /d "%~dp0"
chcp 65001 >nul
call pnpm soan
pause
