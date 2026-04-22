
export const DMDashboard = {
    render(session, players = []) {
        return `
            <div class="dm-dashboard-container glass-panel fade-in-blur" style="padding: 20px; border-color: var(--clr-wine);">
                <h2 class="ornament" style="font-size: 1.2rem; color: var(--clr-gold) !important;">Soberania do Mestre</h2>
                <div class="ornament-divider"></div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h3 style="font-size:0.9rem;">Status da Comitiva</h3>
                        <div id="dm-player-stats" class="scroll-panel" style="max-height: 250px; background: rgba(0,0,0,0.2); border-radius:8px;">
                            ${players.length > 0 ? players.map(p => `
                                <div class="list-item" style="margin-bottom:10px;">
                                    <span><strong>${p.userTag}</strong></span>
                                    <div style="display:flex; gap:10px; align-items:center;">
                                        <div style="font-size:10px;">HP: ${p.hpCurrent || 10}/${p.hpMax || 10}</div>
                                        <button class="grimoire-btn-icon" style="font-size:10px; color:#ff6666;" onclick="window.app.applyDamage('${p.id}', 5)">⚡ Dano</button>
                                        <button class="grimoire-btn-icon" style="font-size:10px; color:#66ff66;" onclick="window.app.applyDamage('${p.id}', -5)">✨ Cura</button>
                                    </div>
                                </div>
                            `).join('') : '<p style="font-size:10px; opacity:0.5; text-align:center;">Nenhum aventureiro conectado...</p>'}
                        </div>
                    </div>
                    <div>
                        <h3 style="font-size:0.9rem;">Bestiário do Grimório</h3>
                        <div class="input-group">
                            <input type="text" id="monster-search" class="grimoire-input" placeholder="Invocação rápida..." oninput="window.app.searchMonsters(this.value)">
                        </div>
                        <div id="monster-results" class="scroll-panel" style="max-height: 200px; margin-top: 10px;">
                            <p style="font-size:10px; opacity:0.5; text-align:center;">Digite para buscar no SRD...</p>
                        </div>
                    </div>
                </div>

                <div style="margin-top:20px;">
                    <h3 style="font-size:0.9rem;">Anotações Secretas</h3>
                    <textarea id="dm-secret-notes" class="grimoire-input" style="height:80px; font-size:11px;" placeholder="Segredos que os jogadores não devem saber..."></textarea>
                </div>
            </div>
        `;
    }
}
