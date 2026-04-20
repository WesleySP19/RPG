@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   GRIMOIRE VAULT VTT - Portal de Inicializacao
echo ===================================================
echo.

:: Check for Node.js
where node >nul 2>1
if %errorlevel% == 0 (
    echo [OK] Node.js detectado. 
    echo Tentando iniciar via NPM...
    
    if exist package-lock.json (
        npm start
    ) else (
        echo [!] Dependencias podem estar faltando. Tentando NPX direto...
        npx http-server ./ -p 8020
    )
    goto :EOF
)

:: Check for Python
where python >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Python detectado. Iniciando servidor...
    echo Acesse: http://localhost:8020
    start http://localhost:8020
    python -m http.server 8020
    goto :EOF
)

:: Fallback if nothing is found
echo [ERRO] Nenhum ambiente (Node.js ou Python) encontrado.
echo.
echo Para rodar o Grimorio corretamente:
echo 1. Instale o Node.js (recomendado) ou Python.
echo 2. Ou arraste o 'index.html' para o navegador (pode haver bugs de script).
echo.
echo Pressione qualquer tecla para abrir o guia de instalacao ou fechar...
pause >nul
start https://nodejs.org/
exit
