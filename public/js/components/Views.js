import { BaseComponent } from '../core/BaseComponent.js';

export class ViewLogin extends BaseComponent {
    onMount() {
        const btn = this.querySelector('rpg-button');
        if (btn) {
            btn.addEventListener('click', () => {
                window.location.hash = '#dashboard';
            });
        }
    }
    
    template() {
        return `
            <div class="layout-login">
                <div class="login-box glass-panel">
                    <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">RPG Forge</h1>
                    <p style="color: var(--clr-text-muted); margin-bottom: 2rem; font-style: italic;">Aventura de Alta Performance</p>
                    
                    <rpg-input label="Nome do Herói / Mestre" placeholder="Ex: Gandalf"></rpg-input>
                    <rpg-button text="Adentrar Taverna"></rpg-button>
                </div>
            </div>
        `;
    }
}

export class ViewDashboard extends BaseComponent {
    template() {
        return `
            <div class="layout-dashboard">
                <div class="dashboard-header glass-panel" style="border-radius: 0;">
                    <h2>Saguão da Taverna</h2>
                    <rpg-button text="Criar Nova Mesa" onclick="window.location.hash='#mesa'"></rpg-button>
                </div>
                <div class="dashboard-grid">
                    <!-- Placeholder Cards -->
                    <div class="glass-panel" style="cursor:pointer;" onclick="window.location.hash='#mesa'">
                        <h3 style="color: var(--clr-text-main);">Caverna do Dragão</h3>
                        <p style="color: var(--clr-text-muted);">Mestre: Zangado</p>
                        <p style="color: var(--clr-text-gold); margin-top: 1rem;">4 Aventureiros Online</p>
                    </div>
                </div>
            </div>
        `;
    }
}

export class ViewMesaPlayer extends BaseComponent {
    template() {
        return `
            <div class="layout-mesa">
                <div class="mesa-panel-left glass-panel">
                    <rpg-character-sheet></rpg-character-sheet>
                    <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto;">
                        <rpg-button text="Sair da Mesa" onclick="window.location.hash='#dashboard'" style="width: 100%;"></rpg-button>
                    </div>
                </div>
                
                <div class="mesa-map-container">
                    <rpg-battlemap></rpg-battlemap>
                </div>
                
                <div class="mesa-panel-right glass-panel">
                    <div style="flex: 1; min-height: 0;">
                        <rpg-chat-log></rpg-chat-log>
                    </div>
                    <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <rpg-dice-roller></rpg-dice-roller>
                    </div>
                </div>
            </div>
        `;
    }
}

export class ViewMesaGM extends BaseComponent {
    template() {
        return `
            <div class="layout-mesa">
                <div class="mesa-panel-left glass-panel">
                    <rpg-gm-panel></rpg-gm-panel>
                    <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto;">
                        <rpg-button text="Finalizar Sessão" onclick="window.location.hash='#dashboard'" style="width: 100%;"></rpg-button>
                    </div>
                </div>
                
                <div class="mesa-map-container" style="flex:1;">
                    <rpg-battlemap></rpg-battlemap>
                </div>
                
                <div class="mesa-panel-right glass-panel">
                    <div style="flex: 1; min-height: 0;">
                        <rpg-chat-log></rpg-chat-log>
                    </div>
                    <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <rpg-dice-roller></rpg-dice-roller>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('view-login', ViewLogin);
customElements.define('view-dashboard', ViewDashboard);
customElements.define('view-mesa-player', ViewMesaPlayer);
customElements.define('view-mesa-gm', ViewMesaGM);
