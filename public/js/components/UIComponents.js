import { BaseComponent } from '../core/BaseComponent.js';

/**
 * <rpg-button>
 * A customized button with thematic styling and click animations.
 */
export class RpgButton extends BaseComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this._onClick.bind(this));
    }

    _onClick(e) {
        // Add shake animation
        const btn = this.querySelector('button');
        if (btn) {
            btn.classList.remove('anim-shake');
            void btn.offsetWidth; // trigger reflow
            btn.classList.add('anim-shake');
        }
        // Audio hook can be added here
    }

    template() {
        const text = this.getAttribute('text') || 'Button';
        const type = this.getAttribute('type') || 'button';
        return `
            <style>
                button {
                    background: linear-gradient(180deg, var(--clr-primary-gold) 0%, var(--clr-primary-gold-dim) 100%);
                    color: var(--clr-bg-absolute);
                    border: 1px solid #FFF;
                    padding: 10px 24px;
                    font-family: var(--font-heading);
                    font-weight: bold;
                    font-size: 1rem;
                    cursor: pointer;
                    border-radius: 4px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                    transition: transform var(--transition-smooth), filter var(--transition-smooth);
                    text-transform: uppercase;
                }
                button:hover {
                    filter: brightness(1.2);
                    transform: translateY(-2px);
                }
                button:active {
                    transform: translateY(1px);
                }
            </style>
            <button type="${type}">${text}</button>
        `;
    }
}

/**
 * <rpg-input>
 * Thematic input field wrapper.
 */
export class RpgInput extends BaseComponent {
    template() {
        const label = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'text';
        const placeholder = this.getAttribute('placeholder') || '';
        const name = this.getAttribute('name') || '';

        return `
            <style>
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    text-align: left;
                }
                label {
                    font-family: var(--font-heading);
                    color: var(--clr-text-gold);
                    font-size: 0.9rem;
                }
                input {
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid var(--clr-primary-gold-dim);
                    padding: 10px;
                    color: var(--clr-text-main);
                    font-family: var(--font-body);
                    border-radius: 4px;
                    outline: none;
                    transition: border-color var(--transition-smooth), box-shadow var(--transition-smooth);
                }
                input:focus {
                    border-color: var(--clr-primary-gold);
                    box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
                }
            </style>
            <div class="input-group">
                <label>${label}</label>
                <input type="${type}" name="${name}" placeholder="${placeholder}" />
            </div>
        `;
    }
}

customElements.define('rpg-button', RpgButton);
customElements.define('rpg-input', RpgInput);
