import { BaseComponent } from '../core/BaseComponent.js';
import { gmStore } from '../core/Store.js';

/**
 * <rpg-gm-panel>
 * Tools for the Game Master to manage the session.
 */
export class RpgGMPanel extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.bindStore(gmStore);
        super.connectedCallback();
    }

    onMount() {
        // Initiative add logic
        const addBtn = this.querySelector('#btn-add-init');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const nameInp = this.querySelector('#init-name');
                const valInp = this.querySelector('#init-val');
                if (nameInp.value && valInp.value) {
                    const newInit = [...gmStore.state.initiative, { 
                        id: Date.now(), 
                        name: nameInp.value, 
                        value: parseInt(valInp.value) 
                    }];
                    // Sort by value descending
                    newInit.sort((a, b) => b.value - a.value);
                    gmStore.update({ initiative: newInit });
                    nameInp.value = '';
                    valInp.value = '';
                }
            });
        }

        // Fog toggle logic
        const fogToggle = this.querySelector('#fog-toggle');
        if (fogToggle) {
            fogToggle.addEventListener('change', (e) => {
                // Dispatch event to battlemap or update a global store prop
                console.log('Fog of War:', e.target.checked);
            });
        }
    }

    template() {
        const initiative = gmStore.state.initiative;

        return `
            <style>
                .gm-panel-container {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                }
                .section-title {
                    font-family: var(--font-heading);
                    color: var(--clr-primary-gold);
                    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }
                .init-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    max-height: 200px;
                    overflow-y: auto;
                }
                .init-item {
                    background: rgba(255,255,255,0.05);
                    padding: 0.5rem;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    border-left: 2px solid var(--clr-primary-gold-dim);
                }
                .init-val {
                    font-weight: bold;
                    color: var(--clr-primary-gold);
                }
                .gm-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .control-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                }
                .input-mini {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 4px;
                    font-size: 0.8rem;
                    width: 60px;
                }
            </style>
            <div class="gm-panel-container">
                <div>
                    <div class="section-title">Controles do Mestre</div>
                    <div class="gm-controls">
                        <div class="control-row">
                            <span>Neblina de Guerra</span>
                            <input type="checkbox" id="fog-toggle" checked>
                        </div>
                        <div class="control-row">
                            <span>Luz Dinâmica</span>
                            <input type="checkbox" checked>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="section-title">Rastreio de Iniciativa</div>
                    <div style="display: flex; gap: 4px; margin-bottom: 1rem;">
                        <input type="text" id="init-name" placeholder="Nome" class="input-mini" style="flex:1;">
                        <input type="number" id="init-val" placeholder="Inic" class="input-mini">
                        <button id="btn-add-init" style="background: var(--clr-primary-gold); border:none; padding: 0 8px; cursor:pointer;">+</button>
                    </div>
                    <div class="init-list">
                        ${initiative.map(item => `
                            <div class="init-item">
                                <span>${item.name}</span>
                                <span class="init-val">${item.value}</span>
                            </div>
                        `).join('')}
                        ${initiative.length === 0 ? '<div style="opacity:0.3; font-size: 0.7rem; text-align:center;">Ninguém na ordem...</div>' : ''}
                    </div>
                </div>

                <div>
                    <div class="section-title">Bestiário Rápido</div>
                    <div style="opacity:0.5; font-size: 0.8rem;">Em breve: Drag & Drop de monstros no mapa.</div>
                </div>
            </div>
        `;
    }
}

customElements.define('rpg-gm-panel', RpgGMPanel);
