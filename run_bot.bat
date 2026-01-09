@echo off
echo 🧹 Mematikan proses bot lama...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo 🚀 Menyalakan Money Flow Bot...
npm start
pause
