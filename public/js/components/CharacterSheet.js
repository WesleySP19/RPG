import { BaseComponent } from '../core/BaseComponent.js';
import { playerStore } from '../core/Store.js';
import { RulesEngine } from '../core/RulesEngine.js';

export class RpgCharacterSheet extends BaseComponent {
    constructor() {
        super();
        this.activeTab = 'stats'; // stats, inventory, spells
    }

    connectedCallback() {
        this.bindStore(playerStore);
        super.connectedCallback();
    }

    onMount() {
        // Tab switching logic
        this.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTab = btn.dataset.tab;
                this.render();
            });
        });

        // Attribute roll logic
        this.querySelectorAll('.attr-box').forEach(box => {
            box.addEventListener('click', async () => {
                const attr = box.dataset.attr;
                const score = playerStore.state.baseAttrs[attr];
                const modifier = await RulesEngine.getModifier(score);
                
                // Trigger global roll event
                const rollResult = await RulesEngine.rollCheck(modifier);
                this.dispatchEvent(new CustomEvent('dice-rolled', {
                    detail: { 
                        result: rollResult.total, 
                        faces: 20,
                        text: `${playerStore.state.name} rolou teste de ${attr.toUpperCase()}: ${rollResult.total} (${rollResult.roll} + ${modifier})`
                    },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    template() {
        const state = playerStore.state;
        const hpPercent = (Math.max(0, state.hp) / state.hpMax) * 100;

        return `
            <style>
                .sheet-container {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                }
                .sheet-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--clr-primary-gold-dim);
                }
                .name {
                    font-family: var(--font-heading);
                    color: var(--clr-primary-gold);
                    font-size: 1.2rem;
                    margin: 0;
                }
                .health-bar-container {
                    background: rgba(0,0,0,0.8);
                    height: 12px;
                    border-radius: 6px;
                    border: 1px solid var(--clr-primary-gold-dim);
                    overflow: hidden;
                    margin-top: 0.5rem;
                }
                .health-bar {
                    background: linear-gradient(90deg, var(--clr-accent-crimson) 0%, var(--clr-accent-crimson-bright) 100%);
                    width: ${hpPercent}%;
                    height: 100%;
                    transition: width var(--transition-bounce);
                }
                .tabs-nav {
                    display: flex;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .tab-btn {
                    flex: 1;
                    padding: 0.5rem;
                    background: transparent;
                    border: none;
                    color: var(--clr-text-muted);
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .tab-btn.active {
                    color: var(--clr-primary-gold);
                    border-bottom: 2px solid var(--clr-primary-gold);
                }
                .tab-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                }
                .attr-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
                .attr-box {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    padding: 0.5rem;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .attr-box:hover {
                    background: rgba(212, 175, 55, 0.1);
                }
                .attr-label {
                    font-size: 0.6rem;
                    color: var(--clr-text-muted);
                    text-transform: uppercase;
                }
                .attr-mod {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--clr-text-main);
                }
                .attr-score {
                    font-size: 0.7rem;
                    color: var(--clr-text-gold);
                }
             </style>
             <div class="sheet-container glass-panel">
                <div class="sheet-header">
                    <h2 class="name">${state.name}</h2>
                    <div class="health-bar-container">
                        <div class="health-bar"></div>
                    </div>
                </div>
                
                <nav class="tabs-nav">
                    <button class="tab-btn ${this.activeTab === 'stats' ? 'active' : ''}" data-tab="stats">Atributos</button>
                    <button class="tab-btn ${this.activeTab === 'inv' ? 'active' : ''}" data-tab="inv">Inventário</button>
                    <button class="tab-btn ${this.activeTab === 'spells' ? 'active' : ''}" data-tab="spells">Magias</button>
                </nav>

                <div class="tab-content">
                    ${this.activeTab === 'stats' ? this.renderStats() : ''}
                    ${this.activeTab === 'inv' ? '<div>Lista de Itens (Vazio)</div>' : ''}
                    ${this.activeTab === 'spells' ? '<div>Compêndio de Magias (Vazio)</div>' : ''}
                </div>
             </div>
        `;
    }

    renderStats() {
        const attrs = playerStore.state.baseAttrs;
        // In a real production app, we would pre-calculate these modifiers in the store
        // to avoid async calls during template generation. 
        // For now, we show the score and allow clicking for the roll.
        return `
            <div class="attr-grid">
                ${Object.entries(attrs).map(([key, score]) => {
                    // Modifiers are typically (Score-10)/2. We can show them synchronously here
                    // while using the worker for the Actual Roll logic.
                    const mod = Math.floor((score - 10) / 2);
                    return `
                        <div class="attr-box" data-attr="${key}">
                            <div class="attr-label">${key}</div>
                            <div class="attr-mod">${mod >= 0 ? '+' : ''}${mod}</div>
                            <div class="attr-score">${score}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

customElements.define('rpg-character-sheet', RpgCharacterSheet);
