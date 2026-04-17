/**
 * Codice Component
 * Trimodal Rulebook (Player, Master, Session).
 */
export const Codice = {
    render(mode = 'player') {
        const sections = mode === 'player' ? this.playerSections : 
                         (mode === 'master' ? this.masterSections : this.sessionSections);
        
        return `
            <div class="codice-tabs" style="display:flex; gap:2px; margin-bottom:1rem; border-bottom:1px solid rgba(184,155,75,0.3); padding-bottom:5px;">
                <button class="tab-btn ${mode === 'player' ? 'active' : ''}" style="flex:1; font-size:9px;" onclick="window.app.setCodiceMode('player')">PLAYER</button>
                <button class="tab-btn ${mode === 'session' ? 'active' : ''}" style="flex:1; font-size:9px;" onclick="window.app.setCodiceMode('session')">SESSÃO</button>
                <button class="tab-btn ${mode === 'master' ? 'active' : ''}" style="flex:1; font-size:9px;" onclick="window.app.setCodiceMode('master')">MESTRE</button>
            </div>
            <div id="codice-body" class="mode-${mode}">
                ${sections.map(s => `
                    <div class="codice-section" style="margin-bottom:1.5rem; border-left:2px solid ${this.getThemeColor(mode)}; padding-left:10px;">
                        <h4 style="font-size:11px; color:var(--clr-gold);">${s.title}</h4>
                        ${s.items.map(i => `
                            <div class="codice-item" style="font-size:10px; margin-top:5px;">
                                <strong>${i.label}:</strong> ${i.text}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                ${mode === 'session' ? `
                    <button class="grimoire-btn" style="width:100%; font-size:10px; border-color:#2ecc71; margin-top:1rem;" onclick="window.app.rollD20()">🎲 TESTE RÁPIDO (1d20)</button>
                ` : ''}
            </div>
        `;
    },

    getThemeColor(mode) {
        if(mode === 'master') return '#722F37';
        if(mode === 'session') return '#2ecc71';
        return '#B89B4B';
    },

    playerSections: [
        { title: "I. Execução", items: [{ label: "Controle", text: "Você controla apenas seu herói." }, { label: "Ação", text: "Use [AÇÃO] + [INTENÇÃO]." }] },
        { title: "II. Convivência", items: [{ label: "Cooperação", text: "Grupo unido sempre." }, { label: "PVP", text: "Só com autorização meta." }] }
    ],

    sessionSections: [
        { title: "I. Etiqueta", items: [{ label: "Resumo", text: "3 fatos em 30s." }, { label: "Foco", text: "Sem TikTok." }] },
        { title: "II. Sistema Lite", items: [{ label: "Testes", text: "1d20+Mod vs CD." }, { label: "CDs", text: "10 Fácil, 15 Médio, 20 Difícil." }] }
    ],

    masterSections: [
        { title: "I. Mediação", items: [{ label: "Ações", text: "Impossível ou Automática." }, { label: "Falha", text: "Sempre falhe com progresso." }] },
        { title: "II. Sistema", items: [{ label: "CD", text: "Ritmo de 2 rodadas máx." }] }
    ]
};
