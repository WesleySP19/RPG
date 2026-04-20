@echo off
setlocal enabledelayedexpansion
title RPG - Start Servers

echo ===================================================
echo     INICIANDO O SISTEMA PSI-RPG (BACKEND + FRONTEND)
echo ===================================================
echo.

:: Configuração Local do Ambiente Java (Para evitar erro de JAVA_HOME)
echo [0] Configurando Vínculos Arcanos (Java)...
set "JAVA_HOME=C:\Program Files\Java\jdk-20"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1] Iniciando o Mestre (Spring Boot Backend - Porta 8080)
echo Isso abrira uma janela preta rodando o Maven. NAO FECHE ELA!
start "Backend (Spring)" cmd /c "cd backend-spring && title Backend Spring Boot && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo.
echo [2] Iniciando o Cofre (Frontend JS/HTML - Porta 8020)
cd GrimoireVault
where node >nul 2>&1
if %errorlevel% == 0 (
    echo Iniciando interface via npx http-server...
    start "Frontend (Node)" cmd /c "title Frontend UI && npx http-server ./ -p 8020"
) else (
    echo Node nao encontrado. Tentando pelo Python...
    start "Frontend (Python)" cmd /c "title Frontend UI && python -m http.server 8020"
)

echo.
echo Tudo iniciado! Aguardando modulos subirem...
timeout /t 5 /nobreak >nul
start http://localhost:8020

echo Pressione qualquer tecla para finalizar este instalador
pause >nul
exit
