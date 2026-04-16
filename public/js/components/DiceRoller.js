import { BaseComponent } from '../core/BaseComponent.js';

export class RpgDiceRoller extends BaseComponent {
    constructor() {
        super();
        this.rolling = false;
        this.result = null;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    onMount() {
        const btn = this.querySelector('.btn-roll');
        if (btn) {
            btn.addEventListener('click', () => this.rollDice());
        }
    }

    rollDice() {
        if (this.rolling) return;
        
        this.rolling = true;
        this.result = null;
        this.render(); // trigger render to show rolling state
        
        // Simulating physical roll delay
        setTimeout(() => {
            this.result = Math.floor(Math.random() * 20) + 1;
            this.rolling = false;
            
            // Dispatch a custom event for the chat log
            this.dispatchEvent(new CustomEvent('dice-rolled', {
                detail: { result: this.result, faces: 20 },
                bubbles: true,
                composed: true
            }));
            
            this.render(); // show result
        }, 800);
    }

    template() {
        return `
            <style>
                .dice-container {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .dice {
                    width: 60px;
                    height: 60px;
                    background: var(--clr-primary-gold);
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #000;
                    box-shadow: var(--glass-shadow);
                    transition: transform var(--transition-bounce);
                }
                .rolling {
                    animation: shakeConfig 0.2s infinite;
                    opacity: 0.8;
                }
                .critical-success {
                    box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.6);
                    background: #DFD;
                }
                .critical-failure {
                    box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.6);
                    background: var(--clr-accent-crimson);
                    color: white;
                }
            </style>
            <div class="dice-container">
                <div class="dice ${this.rolling ? 'rolling' : ''} 
                            ${this.result === 20 ? 'critical-success anim-shake' : ''} 
                            ${this.result === 1 ? 'critical-failure anim-shake' : ''}">
                    ${this.rolling ? '...' : (this.result || 'd20')}
                </div>
                <rpg-button text="Rolar Iniciativa" class="btn-roll"></rpg-button>
            </div>
        `;
    }
}

customElements.define('rpg-dice-roller', RpgDiceRoller);
