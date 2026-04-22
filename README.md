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
