# RPG Forge - High-Performance Vanilla Edition

## Uma Arquitetura Orientada a Performance e Modularidade

O RPG Forge foi concebido com uma filosofia restrita: **Zero dependência de bibliotecas externas complexas (como React ou Vue)** priorizando renderização nativa em alta velocidade e modularidade absurda.

### Como Funciona o Motor?

A nova arquitetura se sustenta em três pilares tecnológicos:

#### 1. Core Reativo (`js/core/Store.js`)
O coração do estado de jogo. Ele utiliza **Proxy API nativa** com duas grandes inovações de performance:
- **Proxy Caching:** Evita a recriação custosa de Proxies repetidos na memória.
- **Micro-Batching:** Quando se altera "Vida", "Mana" e "Status" de um personagem simultaneamente no combate, ao invés de atualizar o DOM 3 vezes causando *Reflows* e quebras de quadro, o `Store.js` empilha (batch) os eventos num único micro-tick de renderização.

#### 2. Web Components Nativos (`js/core/BaseComponent.js`)
A interface gráfica usa o padrão oficial da web (Custom Elements).
Extensões como `<rpg-character-sheet>` e `<view-mesa>` são amarradas diretamente ao `Store` através da abstração e automaticamente recarregam sua string HTML (Super rápido) quando o estado ao qual pertencem é mutado.

#### 3. Renderização Multi-Camada (Battlemap)
O gargalo histórico de Virtual Tabletops é a renderização num único <canvas>. Nós separamos a camada em duas frentes em `js/components/Battlemap.js`:
- **Camada Estática (`layer-static`):** Renderiza o Mapa (background) e a Grade Tática UMA ÚNICA VEZ. Não gasta CPU.
- **Camada Dinâmica (`layer-dynamic`):** Onde os tokens, jogadores, e *Fog Of War* (iluminação) correm, usando recortes vetoriais nativos de contexto (`destination-out`) para o efeito de iluminação dinâmica com sombra, entregando formidáveis **60 FPS constantes**.

---

### Entendendo a Estrutura de Arquivos

- `index.html`: Shell inicial SPA. É a única página carregada no browser.
- `js/app.js`: Instancia o Roteador, simula a carga de servidor e monta o front.
- `js/core/Router.js`: Um roteador Vanilla que captura as hast-tags da url (`#login`, `#mesa`) e injeta o Web Component apropriado limpando o ambiente.
- `js/components/Views.js`: Agregadores grandes (Telas) que importam os mini componentes.
- `css/main.css`: Todo layout de grade via Grid Layout.
- `css/theme.css`: Nosso sistema estético Premium (Deep Gold style) contendo toda a fonte visual de animações de impacto.

### Como Iniciar:
Basta executar um servidor web local rápido no diretório `public` para contornar políticas de CORS usando módulos ESM:
- Via Python: `python -m http.server 8000` (E acesse localhost:8000)
- Via NPX: `npx serve .`

Bem vindo à mesa perfeita.
