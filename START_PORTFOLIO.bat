@echo off
title Subhojit Das - Portfolio Studio Server
color 0A

echo =====================================================================
echo           SUBHOJIT DAS - CREATIVE PORTFOLIO STUDIO SERVER
echo =====================================================================
echo.

:: Ensure Node.js is accessible in PATH
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

:: Navigate to project directory
cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found!
    echo Please make sure Node.js is installed.
    pause
    exit /b 1
)

echo [2/3] Starting Next.js Development Server on Port 3000...
echo [3/3] Opening your portfolio website in your default browser...
echo.
echo =====================================================================
echo  * PUBLIC WEBSITE:     http://localhost:3000
echo  * ADMIN PORTAL:       http://localhost:3000/admin
echo  * ADMIN DASHBOARD:    http://localhost:3000/admin/dashboard
echo =====================================================================
echo.
echo NOTE: KEEP THIS WINDOW OPEN while you are using or editing the website.
echo Press Ctrl + C to stop the server when you are done.
echo.

:: Automatically open browser after 2 seconds
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

:: Start the Next.js server
npm run dev
pause

