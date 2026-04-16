# 📜 Grimoire Vault VTT

**O Companheiro do Aventureiro 5e** - Uma plataforma Virtual Tabletop (VTT) profissional, segura e 100% Vanilla JavaScript.

## 🚀 Como Iniciar

1.  **Windows:** Basta dar dois cliques no arquivo `run.bat`.
2.  **Manual:** Abra o terminal na pasta e digite `python -m http.server 8000`.
3.  **Simples:** Abra o arquivo `index.html` diretamente em qualquer navegador moderno.

## 🛡️ Funcionalidades Principais

-   **Escalabilidade Profissional:** Armazenamento via **IndexedDB** sem limites de espaço.
-   **Segurança Máxima:** Criptografia **AES-GCM** via Web Crypto API (Seus dados ficam no SEU navegador).
-   **Imersão Obsidian Arcane:** Design premium inspirado em pergaminhos e artefatos clássicos.
-   **PWA:** Instale como um aplicativo no seu desktop ou celular.
-   **Sincronização QR:** Compartilhe fichas e chaves de sessão via QR Code.

## 🏗️ Arquitetura (Vanilla JS)

Este projeto foi construído sem bibliotecas externas (React, Vue, etc.) para garantir performance máxima e zero dependências:

-   `js/app.js`: Lógica central e eventos.
-   `js/storage.js`: Motor de criptografia e persistência (IndexedDB).
-   `js/ui.js`: Motor de renderização dinâmica de templates.
-   `js/map.js`: Motor gráfico do mapa tático (Canvas).

---
*Que seus sucessos críticos sejam lendários!*
