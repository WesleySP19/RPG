@echo off
echo ===================================================
echo   REPARADOR DO GRIMOIRE VAULT
echo ===================================================
echo.
echo Este script ira preparar o ambiente para o seu VTT.
echo.

where node >nul 2>1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Redirecionando para o site oficial de download...
    start https://nodejs.org/
    pause
    exit
)

echo [1/2] Limpando caches antigos...
if exist node_modules ( rd /s /q node_modules )

echo [2/2] Instalando novas runas (dependencias)...
call npm install

echo.
echo ===================================================
echo   SISTEMA PRONTO! Use o Run.bat para iniciar.
echo ===================================================
pause
