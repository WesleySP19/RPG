@echo off
echo ===================================================
echo   GRIMOIRE VAULT VTT - Portal de Inicializacao
echo ===================================================
echo.
echo Tentando abrir o Cofre Arcano...
echo.

:: Tenta usar Python para o servidor (comum em Windows/Dev)
where python >nul 2>1
if %errorlevel% == 0 (
    echo [OK] Servidor Python Detectado.
    echo Acesse: http://localhost:8000
    start http://localhost:8000
    python -m http.server 8000
) else (
    :: Tenta usar NPX como fallback
    where npx >nul 2>1
    if %errorlevel% == 0 (
        echo [OK] Servidor Node/NPX Detectado.
        echo Acesse: http://localhost:8080
        npx http-server ./
    ) else (
        echo [ERRO] Nenhum servidor local detectado (Python ou Node).
        echo Por favor, instale o Python ou arraste o 'index.html' para o Chrome.
        echo Nota: Algumas funcoes de modulo JS podem exigir um servidor local.
        pause
    )
)
