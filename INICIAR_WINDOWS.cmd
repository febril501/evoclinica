@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Necesitas instalar Node.js 20 o superior: https://nodejs.org
  pause
  exit /b 1
)
echo.
echo =============================================
echo EvoClinica 0.3 - Iniciando servidor local
 echo =============================================
echo.
echo Abre esta direccion en Chrome o Edge:
echo   http://127.0.0.1:3030
echo.
echo Para cerrar la app, presiona Ctrl+C.
echo.
node server.js
pause
