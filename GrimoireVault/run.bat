@echo off
echo [GRIMOIRE VAULT] Iniciando o Cofre Arcano...
echo 📜 Verificando ambiente...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Python não encontrado. O PWA pode não funcionar offline corretamente.
    echo [INFO] Abrindo o arquivo index.html diretamente...
    start "" "index.html"
) else (
    echo [SUCESSO] Servidor iniciado em http://localhost:8000
    start "" "http://localhost:8000"
    python -m http.server 8000
)
pause
