<div align="center">
  <img src="https://img.shields.io/badge/Versão-4.0.0--ULTRA-blueviolet?style=for-the-badge" alt="Versão 4.0.0">
  <img src="https://img.shields.io/badge/Status-Beta--Realtime-orange?style=for-the-badge" alt="Status Beta">
  <img src="https://img.shields.io/badge/Engine-Vite%20+%20Vanilla-646CFF?style=for-the-badge" alt="Vite JS">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen?style=for-the-badge" alt="Spring Boot">
</div>

<br>

# 📜 Grimoire Vault VTT: The RPG Renaissance
> **"Eleve sua mesa de RPG ao nível épico com performance extrema e imersão absoluta."**

O **Grimoire Vault** é um Virtual Tabletop (VTT) de nova geração focado em **D&D 5e**. Enquanto outros sistemas são pesados e complexos, o Grimoire foca na **estética premium**, **velocidade instantânea** e **facilidade de uso**. Desenvolvido para mestres que querem focar na narrativa, sem que a tecnologia atrapalhe o fluxo do jogo.

---

## ⚔️ Por que o Grimoire Vault?

*   🎭 **Estética Arcaica & Premium:** Uma interface inspirada em grimórios antigos, com efeitos de vidro (Glassmorphism), animações suaves e tipografia elegante.
*   ⚡ **Sincronização em Tempo Real (STOMP):** Role dados, mova tokens e atualize HP instantaneamente para todos os jogadores via WebSockets.
*   🛡️ **Segurança de Nível Industrial:** Autenticação via **JWT (JSON Web Tokens)** e senhas criptografadas. Seus personagens estão seguros no cofre.
*   🎲 **Dashboard do Mestre:** Uma visão divina da mesa. Busque monstros no SRD, aplique dano e gerencie a iniciativa com um clique.
*   🎼 **Aura Sonora:** Trilha sonora atmosférica controlada pelo mestre e sincronizada para toda a comitiva.
*   📱 **Interface Responsiva:** Jogue ou gerencie sua ficha pelo tablet ou celular com um layout adaptativo.

---

## 🏛️ Arquitetura do Sistema

O Grimoire Vault utiliza uma arquitetura moderna de **Servidor de Autoridade**:

1.  **O Grimório (Frontend):** Construído com **Vite** e **Vanilla JS**. Zero frameworks pesados. Apenas performance pura e CSS moderno.
2.  **O Mestre (Backend):** Um motor **Spring Boot 3** robusto que gerencia a lógica, segurança e o banco de dados persistente.
3.  **A Memória (Database):** **H2 Database** com persistência em disco e migrações automatizadas via **Flyway**.

---

## 🚀 Guia de Iniciação Rápida (Passo a Passo)

Siga estas instruções para despertar o seu próprio Grimoire Vault localmente.

### ⚡ Instalação Automática (Recomendado)
Para sua conveniência, existe um script que faz todo o trabalho pesado:
1. Execute o arquivo **`SETUP_AND_INSTALL.bat`** na raiz do projeto.
2. Ele verificará os requisitos, instalará as dependências do Frontend e preparará o Backend.
3. Após terminar, use o **`START_SERVERS.bat`** para rodar tudo de uma vez.

---

### 🛠️ Instalação Manual (Alternativo)
Se preferir fazer manualmente, siga os passos abaixo:

### 1. Pré-requisitos
*   **Java JDK 17** ou superior instalado.
*   **Node.js** (v18+) instalado.
*   **Maven** (opcional, mas recomendado).

### 2. Configurando o Backend (O Cérebro)
1.  Navegue até a pasta `backend-spring`.
2.  Abra um terminal e execute:
    ```bash
    ./mvnw spring-boot:run
    ```
    *O servidor iniciará em `http://localhost:8080`. Ele criará automaticamente o banco de dados e as tabelas na primeira execução.*

### 3. Configurando o Frontend (O Rosto)
1.  Navegue até a pasta `GrimoireVault`.
2.  Instale as dependências do Vite:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    *Acesse `http://localhost:8020` no seu navegador.*

---

## 🤝 Forje o Futuro Conosco (Open Source)

O Grimoire Vault é um projeto **Open Source** e a sua ajuda é o combustível da nossa magia! Acreditamos que a melhor ferramenta de RPG é aquela construída pela própria comunidade.

### Como você pode ajudar?
*   ✨ **Sugira Features:** Tem uma ideia para uma nova mecânica ou efeito visual? Abra uma *Issue*!
*   🐛 **Cace Bugs:** Encontrou um erro arcano? Relate para que possamos bani-lo.
*   💻 **Code & Pull Requests:** Adicione suporte a novos sistemas (Pathfinder, Tormenta), melhore a UI ou otimize o código.
*   📚 **Documentação:** Ajude a traduzir ou melhorar este guia.

> **Regra de Ouro:** Não importa se você é um mago experiente do código ou um aprendiz nível 1. Toda contribuição é valiosa e bem-vinda!

---

## 📜 Licença e Créditos

*   **Desenvolvido por:** HawnkCorp..
*   **Licença:** MIT - Use, modifique e distribua livremente.
*   **Dados:** Regras baseadas no SRD de D&D 5e.

<p align="center">
  <i>"O Grimoire não é apenas um software, é o portal para o seu próximo grande épico."</i><br>
  <b>Role sua iniciativa e junte-se a nós!</b> 🐉✨
</p>

---

> ## 📜 Eng.

<div align="center">
  <img src="https://img.shields.io/badge/Version-4.0.0--ULTRA-blueviolet?style=for-the-badge" alt="Version 4.0.0">
  <img src="https://img.shields.io/badge/Status-Beta--Realtime-orange?style=for-the-badge" alt="Status Beta">
  <img src="https://img.shields.io/badge/Engine-Vite%20+%20Vanilla-646CFF?style=for-the-badge" alt="Vite JS">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen?style=for-the-badge" alt="Spring Boot">
</div>

<br>

# 📜 Grimoire Vault VTT: The RPG Renaissance

> **"Elevate your RPG sessions to epic levels with extreme performance and absolute immersion."**

**Grimoire Vault** is a next-generation Virtual Tabletop (VTT) focused on **D&D 5e**. While other systems are heavy and complex, Grimoire focuses on **premium aesthetics**, **instant speed**, and **ease of use**. Built for Game Masters who want to focus on storytelling without technology getting in the way.

---

## ⚔️ Why Grimoire Vault?

- 🎭 **Premium Ancient Aesthetics:** An interface inspired by ancient grimoires, featuring Glassmorphism, smooth animations, and elegant typography.
- ⚡ **Real-Time Synchronization (STOMP):** Roll dice, move tokens, and update HP instantly for all players via WebSockets.
- 🛡️ **Industrial Grade Security:** Authentication via **JWT (JSON Web Tokens)** and encrypted passwords. Your characters are safe in the vault.
- 🎲 **DM Dashboard:** A divine view of the table. Search monsters in the SRD, apply damage, and manage initiative with one click.
- 🎼 **Sound Aura:** Atmospheric soundtrack controlled by the DM and synchronized for the entire party.
- 📱 **Responsive Interface:** Play or manage your character sheet on tablets or phones with an adaptive layout.

---

## 🏛️ System Architecture

Grimoire Vault uses a modern **Authority Server** architecture:

1.  **The Grimoire (Frontend):** Built with **Vite** and **Vanilla JS**. Zero heavy frameworks. Just pure performance and modern CSS.
2.  **The Master (Backend):** A robust **Spring Boot 3** engine managing logic, security, and the persistent database.
3.  **The Memory (Database):** **H2 Database** with disk persistence and automated migrations via **Flyway**.

---

## 🚀 Quick Start Guide (Step-by-Step)

Follow these instructions to awaken your own local Grimoire Vault.

### 1. Prerequisites

- **Java JDK 17** or higher installed.
- **Node.js** (v18+) installed.
- **Maven** (optional but recommended).

### 2. Setting Up the Backend (The Brain)

1.  Navigate to the `backend-spring` folder.
2.  Open a terminal and run:
    ```bash
    ./mvnw spring-boot:run
    ```
    _The server will start at `http://localhost:8080`. It will automatically create the database and tables on the first run._

### 3. Setting Up the Frontend (The Face)

1.  Navigate to the `GrimoireVault` folder.
2.  Install Vite dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    _Access `http://localhost:8020` in your browser._

---

## 🤝 Forge the Future with Us (Open Source)

Grimoire Vault is an **Open Source** project, and your help is the fuel for our magic! We believe the best RPG tool is the one built by the community itself.

### How can you help?

- ✨ **Suggest Features:** Have an idea for a new mechanic or visual effect? Open an _Issue_!
- 🐛 **Bug Hunting:** Found an arcane error? Report it so we can banish it.
- 💻 **Code & Pull Requests:** Add support for new systems (Pathfinder, etc.), improve the UI, or optimize the code.
- 📚 **Documentation:** Help translate or improve this guide.

> **Golden Rule:** It doesn't matter if you're a seasoned code-wizard or a level 1 apprentice. Every contribution is valuable and welcome!

---

## 📜 License and Credits

- **Developed by:** HawnkCorp.
- **License:** MIT - Use, modify, and distribute freely.
- **Data:** Rules based on the D&D 5e SRD.

<p align="center">
  <i>"The Grimoire is not just software; it is the portal to your next great epic."</i><br>
  <b>Roll your initiative and join us!</b> 🐉✨
</p>
