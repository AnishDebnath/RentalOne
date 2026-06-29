@echo off
REM =============================================
REM Start Camera Rental House Server via Docker
REM Usage: double-click or run from terminal
REM =============================================

echo Stopping old container (if any)...
docker stop camera-rental-house-server 2>nul

echo Removing old container (if any)...
docker rm camera-rental-house-server 2>nul

echo Starting new server container...
docker run -d --rm --name camera-rental-house-server -p 5000:5000 --env-file "%~dp0server\.env" camera-rental-house-server:latest

if %errorlevel% equ 0 (
    echo.
    echo ✓ Server container started successfully!
    echo   API: http://localhost:5000/api
    echo   Health: http://localhost:5000/api/health
    echo.
    echo To stop: docker stop camera-rental-house-server
) else (
    echo.
    echo ✗ Failed to start container.
    echo   Make sure Docker Desktop is running.
)
