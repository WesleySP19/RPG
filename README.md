<div align="center">
  <img src="https://img.shields.io/badge/Versão-3.0.3-blueviolet?style=for-the-badge" alt="Versão 3.0.3">
  <img src="https://img.shields.io/badge/Status-Produção-success?style=for-the-badge" alt="Status Produção">
  <img src="https://img.shields.io/badge/Engine-Vanilla%20JS-yellow?style=for-the-badge" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen?style=for-the-badge" alt="Spring Boot">
</div>

# 📜 Grimoire Vault VTT: Master Architect Edition

Bem-vindos ao futuro das suas aventuras de RPG. O **Grimoire Vault** evoluiu de um simples Cofre Arcano para uma infraestrutura completa de Virtual Tabletop (VTT), focada em imersão, performance extrema e facilidade de uso.

Esta versão **3.0.3** marca a transição definitiva para uma arquitetura profissional, abandonando dependências externas pesadas em favor de um **Servidor de Autoridade (Mestre)** robusto e um **Frontend Pure Vanilla** ultra-veloz.

---

## 🏛️ Nova Arquitetura: O Equilíbrio entre Poder e Leveza

Diferente de outros VTTs que exigem máquinas potentes ou configurações complexas, o Grimoire Vault foi reimaginado com uma modularidade estratégica:

*   **⚡ Frontend (O Cofre):** Construído 100% em Vanilla JavaScript, HTML5 e CSS3. Sem frameworks pesados (React/Angular/Vue), garantindo que os dados rolem a 60fps mesmo em máquinas modestas.
*   **🛡️ Backend (O Mestre):** Um servidor de autoridade robusto construído em **Spring Boot (Java 17)**. Ele gerencia a persistência de personagens, sincronização de sessões e segurança dos dados.
*   **💾 Database:** Utiliza **H2 Database** (para portabilidade e testagem rápida) integrado via **Spring Data JPA**.

---

## ⚔️ O Que Tem no Baú do Tesouro? (Features)

*   🏰 **Persistência de Personagem Real:** Suas fichas não vivem mais apenas no navegador. Elas são salvas em um banco de dados centralizado via API REST, permitindo acesso de qualquer lugar.
*   🎲 **D&D 5e "Loyal Pro":** Automação total de fichas de D&D 5e. Cálculos de modificadores, bônus de proficiência, salvaguardas e slots de magia automáticos.
*   👁️ **Visão Tática Dinâmica:** Sistema de névoa de guerra e campo de visão em tempo real focado no seu Token. Se o seu personagem não vê, você também não vê.
*   🎼 **Aura Sonora Sincronizada:** O Mestre controla a trilha sonora e ela toca instantaneamente para todos os jogadores, criando a atmosfera perfeita para cada encontro.
*   ⚡ **Zero-Lag Interface:** Menus e janelas projetados para serem táteis e rápidos, com suporte a Drag & Drop para o Compêndio Arcano.

---

## 🚀 Como Iniciar a Jornada

O sistema foi preparado para ser iniciado com um único feitiço (script).

### Pré-requisitos
*   **Java JDK 17** ou superior.
*   **Node.js** (opcional, para o servidor de arquivos do frontend) ou **Python**.
*   **Maven** (integrado opcionalmente).

### Passo a Passo
1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/seu-usuario/RPG.git
    cd RPG
    ```
2.  **Invoque os Servidores:**
    Execute o arquivo `START_SERVERS.bat` na raiz do projeto. Isso irá:
    *   Iniciar o **Backend Spring Boot** na porta `8080`.
    *   Iniciar o **Frontend** na porta `8020`.
    *   Abrir seu navegador automaticamente em `localhost:8020`.

3.  **Role os Dados!** 🎲

---

## 🛠️ O Arsenal Tecnológico (Tech Stack)

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | Vanilla JS, CSS Variables, HTML5 Canvas, IndexedDB (Fallback) |
| **Backend** | Java 17, Spring Boot 3.1.5, Spring Security, Maven |
| **Persistência** | Hibernate / Spring Data JPA, H2 Database |
| **Comunicação** | Protocólos RESTful, WebSockets (Sync) |

---

## 🤝 Contribua com o Feitiço

Este projeto é **Open Source** e aceita sugestões de melhorias, novos sistemas (Pathfinder, Tormenta20) ou correções de bugs.

1.  Dê um `Fork` no projeto.
2.  Crie sua branch de feature (`git checkout -b feature/SuaMecanica`).
3.  Faça o `Commit` (`git commit -m 'Mod: Adicionado Necromancia'`).
4.  Abra um `Pull Request`.

---

<p align="center">
  <i>"Não é apenas sobre os números na ficha, é sobre a história que contamos juntos."</i><br>
  <b>Grimoire Vault Team</b> 🐉✨
</p>

