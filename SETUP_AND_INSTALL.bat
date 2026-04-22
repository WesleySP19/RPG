@echo off
setlocal enabledelayedexpansion
title Grimoire Vault - Setup e Instalação
color 0B

echo ============================================================
echo           GRIMOIRE VAULT - INSTALADOR DE DEPENDENCIAS
echo ============================================================
echo.

:: 1. Verificando Node.js
echo [1/4] Verificando Requisitos: Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado. Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b
)
echo [OK] Node.js detectado.
echo.

:: 2. Verificando Java / Maven
echo [2/4] Verificando Requisitos: Java e Maven...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Java nao encontrado no PATH. O backend pode falhar ao compilar.
) else (
    echo [OK] Java detectado.
)

where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Maven (mvn) nao encontrado no PATH.
    echo Tentando verificar se existe um wrapper (mvnw) no backend...
)
echo.

:: 3. Instalando dependencias do Frontend (Vite)
echo [3/4] Instalando dependencias do Frontend (GrimoireVault)...
cd GrimoireVault
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do Frontend.
    cd ..
    pause
    exit /b
)
cd ..
echo [OK] Dependencias do Frontend instaladas com sucesso.
echo.

:: 4. Preparando o Backend (Spring Boot)
echo [4/4] Preparando o Backend (backend-spring)...
cd backend-spring
if exist mvnw (
    echo Usando Maven Wrapper (mvnw)...
    call mvnw clean install -DskipTests
) else (
    where mvn >nul 2>&1
    if %errorlevel% == 0 (
        echo Usando Maven do sistema...
        call mvn clean install -DskipTests
    ) else (
        echo [AVISO] Nao foi possivel compilar o backend automaticamente. 
        echo Certifique-se de ter o Maven instalado ou abra o projeto em uma IDE (IntelliJ/VS Code).
    )
)
cd ..
echo [OK] Processo de preparacao concluido.
echo.

echo ============================================================
echo           INSTALACAO CONCLUIDA COM SUCESSO!
echo ============================================================
echo.
echo Agora voce pode usar o arquivo 'START_SERVERS.bat' para rodar o projeto.
echo.
echo Pressione qualquer tecla para sair...
pause >nul
exit
