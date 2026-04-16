import { BaseComponent } from '../core/BaseComponent.js';
import { Sanitizer } from '../core/Sanitizer.js';

export class RpgChatLog extends BaseComponent {
    constructor() {
        super();
        this.messages = [];
    }

    connectedCallback() {
        super.connectedCallback();
        // Listen to global dice rolls simulated from the window/document
        document.addEventListener('dice-rolled', this.handleGlobalEvent.bind(this));
    }

    onUnmount() {
        document.removeEventListener('dice-rolled', this.handleGlobalEvent.bind(this));
    }

    handleGlobalEvent(e) {
        this.addMessage(`Rolou d${e.detail.faces}: <strong>${e.detail.result}</strong>`);
    }

    addMessage(htmlContent) {
        // Keeps only last 50 messages to prevent DOM bloat
        if (this.messages.length > 50) this.messages.shift();
        this.messages.push({
            id: Date.now(),
            text: htmlContent,
            time: new Date().toLocaleTimeString()
        });
        this.render();
        
        // Auto-scroll logic could be added here in onMount
    }

    onMount() {
        const container = this.querySelector('.chat-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }

        const input = this.querySelector('input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim() !== '') {
                    const cleanMsg = Sanitizer.escapeHTML(input.value);
                    this.addMessage(`Tu diz: <span>${cleanMsg}</span>`);
                    input.value = '';
                }
            });
        }
    }

    template() {
        return `
            <style>
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background: rgba(0,0,0,0.4);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .chat-msg {
                    background: var(--clr-bg-surface);
                    padding: 8px 12px;
                    border-radius: 4px;
                    border-left: 3px solid var(--clr-primary-gold-dim);
                    font-size: 0.9rem;
                    animation: slideIn 0.2s ease-out;
                }
                .msg-time {
                    font-size: 0.7rem;
                    color: var(--clr-text-muted);
                    display: block;
                    margin-bottom: 4px;
                }
                .chat-input {
                    padding: 0.5rem;
                    background: var(--clr-bg-absolute);
                    border-top: 1px solid var(--clr-primary-gold-dim);
                }
                .chat-input input {
                    width: calc(100% - 1rem); /* Quick padding adjust */
                    background: transparent;
                    border: none;
                    color: white;
                    outline: none;
                    padding: 8px;
                    font-family: var(--font-body);
                }
                @keyframes slideIn {
                    from { transform: translateX(-10px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
            <div class="chat-container">
                <div class="chat-messages">
                    ${this.messages.map(m => `
                        <div class="chat-msg">
                            <span class="msg-time">${m.time}</span>
                            <div>${m.text}</div>
                        </div>
                    `).join('')}
                    ${this.messages.length === 0 ? '<div style="opacity: 0.5; text-align:center;">O silêncio ecoa na taverna...</div>' : ''}
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Escreva a sua lenda..." />
                </div>
            </div>
        `;
    }
}

customElements.define('rpg-chat-log', RpgChatLog);
