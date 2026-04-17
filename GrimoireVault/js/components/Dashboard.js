/**
 * Dashboard Component
 * Managing Heroes and Active Sessions.
 */
export const Dashboard = {
    render(profile, sessions = {}) {
        return `
            <header class="view-header" style="display:flex; justify-content:space-between; align-items:center;">
                <h1 class="ornament">Painel de Comando</h1>
                <div style="font-size:10px; opacity:0.5;">PERFIL: ${profile.key}</div>
            </header>

            <div class="dashboard-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
                <!-- Hero Panel -->
                <div class="panel glass-panel" style="padding:15px; min-height:300px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Sua Comitiva</h3>
                        <select id="char-filter-class" class="grimoire-input" style="width:auto; font-size:10px;" onchange="window.app.filterHeroes()">
                            <option value="all">Filtro: TODOS</option>
                            <option value="Guerreiro">Guerreiro</option>
                            <option value="Mago">Mago</option>
                            <option value="Ladino">Ladino</option>
                        </select>
                    </div>
                    <div id="character-list" class="list-container scroll-panel" style="max-height:200px;"></div>
                    <button class="grimoire-btn" style="width:100%; margin-top:1rem;" onclick="window.app.openSheet()">+ FORJAR NOVO HERÓI</button>
                </div>

                <!-- Session Panel -->
                <div class="panel glass-panel" style="padding:15px; min-height:300px;">
                    <h3>Mesas Ativas</h3>
                    <div id="active-sessions" class="list-container scroll-panel" style="max-height:200px; margin-top:1rem;"></div>
                    <div style="display:flex; gap:10px; margin-top:1rem;">
                        <button class="grimoire-btn" style="flex:1;" onclick="window.app.createSession()">MESTRAR</button>
                        <button class="grimoire-btn" style="flex:1;" onclick="window.app.joinSession()">ENTRAR</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderCharList(chars = []) {
        if (chars.length === 0) return '<p style="font-size:10px; opacity:0.3; text-align:center;">Nenhum herói encontrado...</p>';
        return chars.map(c => `
            <div class="list-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px; margin-bottom:5px; border-bottom:1px solid rgba(184,155,75,0.2);">
                <span><strong>${c.name}</strong> <small style="opacity:0.6;">(${c.class})</small></span>
                <button class="grimoire-btn-icon" onclick="window.app.openSheet('${c.id}')">✎</button>
            </div>
        `).join('');
    },

    renderSessionList(sessions = {}) {
        const keys = Object.keys(sessions);
        if (keys.length === 0) return '<p style="font-size:10px; opacity:0.3; text-align:center;">Nenhuma mesa aberta...</p>';
        return keys.map(k => `
            <div class="list-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid rgba(184,155,75,0.2);">
                <span>MESA: <strong>${k}</strong></span>
                <button class="grimoire-btn" style="font-size:10px; padding:2px 10px;" onclick="window.app.enterSession('${k}')">ENTRAR</button>
            </div>
        `).join('');
    }
};
