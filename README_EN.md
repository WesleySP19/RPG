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
