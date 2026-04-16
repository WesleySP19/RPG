export const UI = {
    showView(viewId) {
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });
        const current = document.getElementById(viewId);
        if (current) current.classList.add('active');
    },

    /**
     * Character Sheet Template
     */
    /**
     * Character Sheet Template (Tabs-based)
     */
    renderCharacterForm(char = null) {
        return `
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="tab-base">Fundamentos</button>
                <button class="tab-btn" data-tab="tab-stats">Atributos</button>
                <button class="tab-btn" data-tab="tab-combat">Combate</button>
                <button class="tab-btn" data-tab="tab-bio">Grimório</button>
            </div>

            <div class="tab-content" id="form-tabs">
                <!-- ABA: FUNDAMENTOS -->
                <div class="tab-pane active" id="tab-base">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group" style="grid-column: span 2;">
                            <label>Nome do Herói</label>
                            <input type="text" id="char-name" class="grimoire-input" value="${char?.name || ''}">
                        </div>
                        <div class="form-group">
                            <label>Raça</label>
                            <input type="text" id="char-race" class="grimoire-input" value="${char?.race || ''}">
                        </div>
                        <div class="form-group">
                            <label>Classe</label>
                            <input type="text" id="char-class" class="grimoire-input" value="${char?.class || ''}">
                        </div>
                    </div>
                </div>

                <!-- ABA: ATRIBUTOS -->
                <div class="tab-pane" id="tab-stats">
                    <p style="font-size:0.7rem; color:var(--clr-wine); margin-bottom:1rem;">* Atributos influenciam perícias e combate automaticamente.</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                        ${['For', 'Des', 'Con', 'Int', 'Sab', 'Car'].map(attr => {
                            const score = char?.attributes?.[attr.toLowerCase()] || 10;
                            const mod = Math.floor((score - 10) / 2);
                            return `
                            <div class="attr-input-group" style="text-align: center;">
                                <label style="font-size: 0.7rem; font-weight:bold;">${attr}</label>
                                <input type="number" id="attr-${attr.toLowerCase()}" class="grimoire-input attr-trigger" value="${score}" style="text-align:center;">
                                <div class="attr-mod-badge" id="mod-${attr.toLowerCase()}" style="font-size: 0.9rem; color: var(--clr-wine); font-weight:bold; margin-top:2px;">
                                    ${mod >= 0 ? '+' : ''}${mod}
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ABA: COMBATE -->
                <div class="tab-pane" id="tab-combat">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>HP Máximo</label>
                            <input type="number" id="char-hp" class="grimoire-input" value="${char?.hp || 10}">
                        </div>
                        <div class="form-group">
                            <label>CA (Classe de Armadura)</label>
                            <input type="number" id="char-ac" class="grimoire-input" value="${char?.ac || 10}">
                        </div>
                    </div>
                </div>

                <!-- ABA: BIO/GRIMÓRIO -->
                <div class="tab-pane" id="tab-bio">
                    <div class="form-group">
                        <label>Itens, Magias e História</label>
                        <textarea id="char-bio" class="grimoire-input" style="height: 150px; border: 1px solid var(--clr-gold);">${char?.bio || ''}</textarea>
                    </div>
                </div>
            </div>

            <button id="btn-save-char" class="grimoire-btn" style="width: 100%; margin-top: 2rem;">Selar Ficha no Grimório</button>
        `;
    },

    /**
     * Read-Only Sheet (Perchment Mode)
     */
    renderReadOnlySheet(char) {
        return `
            <div class="sheet-scroll-mode" style="padding: 1rem; border: 1px dashed var(--clr-gold);">
                <header style="text-align: center; border-bottom: 2px solid var(--clr-wine); padding-bottom: 1rem;">
                    <h1 style="font-size: 1.5rem;">${char.name}</h1>
                    <p>${char.race} ${char.class} - Nível 1</p>
                </header>
                
                <div style="display: flex; justify-content: space-around; margin: 1.5rem 0;">
                    ${['for', 'des', 'con', 'int', 'sab', 'car'].map(a => `
                        <div style="text-align:center;">
                            <span style="font-size:0.6rem; text-transform:uppercase;">${a}</span>
                            <div style="font-size:1.2rem; font-weight:bold; color:var(--clr-wine);">${char.attributes[a]}</div>
                        </div>
                    `).join('')}
                </div>

                <div style="background: rgba(0,0,0,0.03); padding: 1rem; margin-top: 1rem;">
                    <p><strong>Biografia / Notas:</strong></p>
                    <p style="font-size:0.8rem; white-space: pre-wrap;">${char.bio || 'Sem notas...'}</p>
                </div>
                
                <button class="grimoire-btn" style="width:100%; margin-top:1rem; font-size:0.7rem;" onclick="window.app.editChar('${char.id}')">Editar Pergaminho</button>
            </div>
        `;
    },


    /**
     * Lists Rendering
     */
    renderCharacterList(characters) {
        if (characters.length === 0) return '<p style="opacity: 0.5;">Nenhuma ficha encontrada...</p>';
        return characters.map(c => `
            <div class="list-item" style="border: 1px solid var(--clr-gold); padding: 0.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items:center;">
                <span style="font-size:0.9rem;">${c.name} <br> <small style="opacity:0.6;">Nvl 1 ${c.class}</small></span>
                <button class="grimoire-btn" style="font-size: 0.6rem; padding: 4px 12px;" onclick="window.app.openChar('${c.id}')">Explorar</button>
            </div>
        `).join('');
    },

    renderCharacterSelector(characters) {
        return `
            <div style="text-align:center;">
                <h3>Quem você será hoje?</h3>
                <p style="font-size:0.7rem; margin-bottom:1rem;">Escolha seu avatar para esta mesa.</p>
                <div style="display:grid; gap:0.5rem;">
                    ${characters.map(c => `
                        <button class="grimoire-btn" style="text-align:left; font-size:0.8rem;" onclick="window.app.confirmJoin('${c.id}')">
                            ${c.name} (${c.class})
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSessionList(sessions, isMaster = false) {
        // sessions would be keys
        if (Object.keys(sessions).length === 0) return '<p style="opacity: 0.5;">Nenhuma sessão ativa...</p>';
        return Object.keys(sessions).map(id => `
            <div class="list-item" style="border: 1px solid var(--clr-wine); padding: 0.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                <span>Mesa: ${id}</span>
                <button class="grimoire-btn" style="font-size: 0.6rem; padding: 2px 8px;" onclick="window.app.enterSession('${id}')">Jogar</button>
            </div>
        `).join('');
    },

    /**
     * Session Diary & Logs
     */
    renderSessionDiary(logs = []) {
        if (logs.length === 0) return '<p style="opacity:0.3; text-align:center;">O diário está em branco...</p>';
        return logs.map(log => `
            <div class="log-entry" style="border-left: 2px solid var(--clr-gold); padding-left: 1rem; margin-bottom: 1rem;">
                <header style="font-size: 0.7rem; opacity: 0.6; display: flex; justify-content: space-between;">
                    <span>${log.author}</span>
                    <span>${new Date(log.timestamp).toLocaleTimeString()}</span>
                </header>
                <p style="font-size: 0.9rem;">${log.message}</p>
            </div>
        `).reverse().join('');
    },

    /**
     * SRD Compendium
     */
    renderSRD(data, query = '', filter = 'all', level = 'all') {
        const lowerQuery = query.toLowerCase();
        
        let filteredSpells = data.spells.filter(s => s.name.toLowerCase().includes(lowerQuery));
        if (level !== 'all') filteredSpells = filteredSpells.filter(s => s.level == level);
        
        let filteredMonsters = data.monsters.filter(m => m.name.toLowerCase().includes(lowerQuery));

        return `
            <div style="text-align: left;">
                <div style="display:flex; gap:4px; margin-bottom:1rem;">
                    <button class="grimoire-btn srd-filter ${filter === 'all' ? 'active' : ''}" data-filter="all" style="font-size:0.5rem; flex:1;">Tudo</button>
                    <button class="grimoire-btn srd-filter ${filter === 'spells' ? 'active' : ''}" data-filter="spells" style="font-size:0.5rem; flex:1;">Magias</button>
                    <button class="grimoire-btn srd-filter ${filter === 'monsters' ? 'active' : ''}" data-filter="monsters" style="font-size:0.5rem; flex:1;">Monstros</button>
                </div>
                
                <div style="display:flex; gap:8px; align-items:center;">
                    <input type="text" id="srd-search" class="grimoire-input" placeholder="Buscar..." value="${query}" autofocus style="flex:1;">
                    ${filter === 'spells' ? `
                        <select id="srd-level-filter" class="grimoire-input" style="width:80px; font-size:0.7rem;">
                            <option value="all">Nível</option>
                            ${[0,1,2,3,4,5,6,7,8,9].map(l => `<option value="${l}" ${level == l ? 'selected' : ''}>Lv ${l}</option>`).join('')}
                        </select>
                    ` : ''}
                </div>

                <div style="height: 300px; overflow-y: auto; margin-top: 1rem; padding-right:5px;" class="scroll-panel glass-panel">
                    ${(filter === 'all' || filter === 'spells') ? `
                        <h4 style="font-size:0.7rem; border-bottom:1px solid var(--clr-wine);">Magias (${filteredSpells.length})</h4>
                        ${filteredSpells.map(s => `
                            <div class="srd-item" style="padding:4px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
                                <strong style="color:var(--clr-wine); font-size:0.8rem;">${s.name}</strong> 
                                <span style="font-size:0.6rem; opacity:0.6;">(Nv ${s.level} ${s.school})</span>
                            </div>
                        `).join('')}
                    ` : ''}
                    
                    ${(filter === 'all' || filter === 'monsters') ? `
                        <h4 style="font-size:0.7rem; border-bottom:1px solid var(--clr-wine); margin-top:1rem;">Monstros (${filteredMonsters.length})</h4>
                        ${filteredMonsters.map(m => `
                            <div class="srd-item" style="padding:4px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
                                <strong style="color:var(--clr-wine); font-size:0.8rem;">${m.name}</strong> 
                                <span style="font-size:0.6rem; opacity:0.6;">(CR ${m.cr})</span>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderMapContainer() {
        return `
            <div style="text-align: center;">
                <canvas id="tactical-canvas" width="450" height="300" style="background:#0f0f12; border:2px solid var(--clr-gold); box-shadow: 0 0 20px rgba(184, 155, 75, 0.2);"></canvas>
                <div style="margin-top: 1rem; display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">
                    <button id="btn-add-token-pc" class="grimoire-btn" style="font-size:0.5rem; padding:4px 8px;">+ Herói</button>
                    <button id="btn-add-token-npc" class="grimoire-btn" style="font-size:0.5rem; padding:4px 8px; background:#D0021B;">+ Monstro</button>
                    <button id="btn-clear-map" class="grimoire-btn" style="font-size:0.5rem; padding:4px 8px; background:transparent;">Limpar</button>
                </div>
            </div>
        `;
    },

    /**
     * DM TOOLS & ENCOUNTER GENERATOR
     */
    renderEncounterGenerator(monsters) {
        return `
            <div style="text-align: left;">
                <h3>Gerador de Encontros</h3>
                <p style="font-size:0.7rem;">Orçamento baseado no nível do grupo.</p>
                <div style="display:flex; gap:0.5rem; margin:1rem 0;">
                    <input type="number" id="group-size" class="grimoire-input" value="4" style="width:50px;">
                    <input type="number" id="group-level" class="grimoire-input" value="1" style="width:50px;">
                    <button id="btn-calc-encounter" class="grimoire-btn" style="font-size:0.6rem;">Gerar</button>
                </div>
                <div id="encounter-result" style="font-size:0.8rem; margin-top:1rem;"></div>
            </div>
        `;
    },

    renderDMTools() {
        return `
            <div class="dm-overlay" style="background: rgba(94, 31, 45, 0.1); border: 2px solid var(--clr-wine); padding: 1rem; margin-top: 1rem; box-shadow: 0 0 15px rgba(94, 31, 45, 0.3);">
                <h4 style="font-size:0.7rem; color:var(--clr-wine); text-shadow: 0 0 5px rgba(94, 31, 45, 0.5);">👁️ Mão do Destino (Mestre)</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.5rem;">
                    <button id="btn-hidden-roll" class="grimoire-btn" style="font-size:0.5rem; border-color:var(--clr-wine);">Rolagem Oculta</button>
                    <button id="btn-send-whisper" class="grimoire-btn" style="font-size:0.5rem; border-color:var(--clr-wine);">Enviar Sussurro</button>
                    <button id="btn-gen-encounter" class="grimoire-btn" style="font-size:0.5rem;">Gerador de Encontro</button>
                    <button id="btn-open-map" class="grimoire-btn" style="font-size:0.5rem;">Mapa Tático</button>
                </div>
            </div>
        `;
    },

    renderPlayerSessionControls(char) {
        const hpPerc = Math.min(100, (char.hp / 10) * 100); // Exemplo simplificado
        return `
            <div style="margin-top:1rem; padding:1rem; background:rgba(184, 155, 75, 0.05); border:1px solid var(--clr-gold);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:var(--font-heading); font-size:0.9rem;">${char.name}</span>
                    <span style="font-size:0.7rem; color:var(--clr-wine);">CA: ${char.ac || 10}</span>
                </div>
                <div style="width:100%; height:10px; background:#444; margin-top:5px; border-radius:5px; overflow:hidden;">
                    <div style="width:${hpPerc}%; height:100%; background:var(--clr-wine); transition: width 0.3s ease;"></div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:1rem;">
                    <button id="btn-voice-roll" class="grimoire-btn" style="font-size:0.5rem;">🎤 Rolagem de Voz</button>
                    <button class="grimoire-btn" style="font-size:0.5rem;" onclick="window.app.openChar('${char.id}')">📂 Ver Ficha</button>
                </div>
            </div>
        `;
    },

    /**
     * TAVERN & HOMEBREW
     */
    renderTavern(posts = []) {
        if (posts.length === 0) return '<p style="opacity:0.3; text-align:center; font-size:0.7rem;">A taverna está silenciosa...</p>';
        return posts.map(p => `
            <div style="margin-bottom:0.5rem; border-bottom:1px solid rgba(184, 155, 75, 0.1);">
                <span style="font-size:0.6rem; color:var(--clr-gold);">${p.author}:</span>
                <span style="font-size:0.7rem;">${p.message}</span>
            </div>
        `).reverse().join('');
    },

    renderHomebrewBuilder() {
        return `
            <div style="text-align: left;">
                <h3>Oficina de Homebrew</h3>
                <p style="font-size:0.7rem; margin-bottom:1rem;">Crie pergaminhos personalizados.</p>
                <input type="text" id="hb-name" class="grimoire-input" placeholder="Nome do Item/Raça">
                <textarea id="hb-desc" class="grimoire-input" style="height:100px; margin-top:0.5rem;" placeholder="Descrição das propriedades..."></textarea>
                <button id="btn-save-homebrew" class="grimoire-btn" style="width:100%; margin-top:1rem;">Selar com QR</button>
            </div>
        `;
    }
};

window.VaultUI = UI;
