
import { Storage } from './services/Storage.js';
import { State } from './core/State.js';
import { TacticalMap } from './components/TacticalMap.js';
import { Security } from './services/Security.js';
import { Network } from './services/Network.js';
import { SoundEngine } from './components/SoundEngine.js';
import { DiceEngine } from './components/DiceEngine.js';
import { GameEngine } from './core/GameEngine.js';
import { UI } from './components/ui.js';

const App = {
    playerId: null,
    token: null,
    userTag: null,
    currentSessionKey: null,
    editingCharId: null,
    mapInstance: null,
    srdData: null,

    async init() {
        console.log("⚡ [Grimório] Despertando Fluxo Mestre...");
        try {
            await Storage.init();
            console.log("✔ [Storage] IndexedDB pronto.");
            
            this.setupListeners();
            console.log("✔ [Eventos] Escutando o mundo.");
            
            UI.renderCodice('player');
            console.log("✔ [UI] Códice renderizado.");

            const savedPlayer = localStorage.getItem('grimoire_player_id');
            const savedToken = localStorage.getItem('grimoire_token');
            const savedTag = localStorage.getItem('grimoire_tag');

            if (savedPlayer && savedToken) {
                const decoded = Security.decodeToken(savedToken);
                if (decoded && decoded.sub === savedPlayer) {
                    console.log("✔ [Auth] Sessão persistente: " + savedTag);
                    this.playerId = savedPlayer;
                    this.token = savedToken;
                    this.userTag = savedTag;

                    await Storage.fetchPlayerCharacters(this.playerId);
                    this.loadDashboard();
                }
            }
        } catch (e) {
            console.error("❌ [Erro Arcano] Falha no despertar:", e);
        } finally {

            setTimeout(() => {
                const splash = document.getElementById('splash-screen');
                if (splash) {
                    splash.classList.add('fade-out');
                    console.log("✔ [System] Splash Screen removida.");
                }
            }, 800);
        }
    },

    setupListeners() {

        const tabLogin = document.getElementById('tab-login');
        const tabReg = document.getElementById('tab-register');
        const formLogin = document.getElementById('form-login');
        const formReg = document.getElementById('form-register');

        if (tabLogin && tabReg) {
            tabLogin.onclick = () => {
                formLogin.style.display = 'block';
                formReg.style.display = 'none';
                tabLogin.style.background = 'rgba(184, 155, 75, 0.2)';
                tabReg.style.background = 'transparent';
                this.hideAuthError();
            };
            tabReg.onclick = () => {
                formLogin.style.display = 'none';
                formReg.style.display = 'block';
                tabLogin.style.background = 'transparent';
                tabReg.style.background = 'rgba(184, 155, 75, 0.2)';
                this.hideAuthError();
            };
        }

        const btnReg = document.getElementById('btn-auth-register');
        if (btnReg) btnReg.onclick = async () => {
            const tag = document.getElementById('auth-reg-tag').value.trim();
            const email = document.getElementById('auth-reg-id').value.trim();
            if (!tag || !email) return this.showAuthError("Preencha todos os campos.");
            
            try {
                const result = await Storage.registerUser(email, tag);
                this.authenticate(result);
            } catch(e) {
                this.showAuthError(e.message);
            }
        };

        const btnLogin = document.getElementById('btn-auth-login');
        if (btnLogin) btnLogin.onclick = async () => {
            const email = document.getElementById('auth-login-id').value.trim();
            if (!email) return this.showAuthError("Insira seu identificador.");

            try {
                const result = await Storage.loginUser(email);
                this.authenticate(result);
            } catch(e) {
                this.showAuthError(e.message);
            }
        };

        document.getElementById('btn-add-note').onclick = () => this.addDiaryNote();
        document.getElementById('btn-back-dashboard').onclick = () => UI.showView('view-dashboard');
        document.getElementById('btn-leave-session').onclick = () => this.leaveSession();
        document.getElementById('btn-open-map').onclick = () => this.openMap();
        document.getElementById('btn-open-srd').onclick = () => this.showSRD('items');

        window.addEventListener('beforeinstallprompt', (e) => {
            console.log("PWA Pronto para Instalação");

        });

        const sendBtn = document.getElementById('btn-send-action');
        const actionInput = document.getElementById('action-input');
        
        if (sendBtn && actionInput) {
            const handleAction = async () => {
                const text = actionInput.value.trim();
                if (!text) return;
                
                actionInput.value = '';
                this.addPacketToLog('player', text);
                await GameEngine.processAction(text);
            };

            sendBtn.addEventListener('click', handleAction);
            actionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleAction();
            });
        }

        window.addEventListener('engine-response', (e) => {
            this.addPacketToLog('dm', e.detail);
            this.syncSessionStats(e.detail.atualizacao);
        });
    },

    showAuthError(msg) {
        const d = document.getElementById('auth-error-msg');
        if(d) { d.innerText = msg; d.style.display = 'block'; }
    },
    hideAuthError() {
        const d = document.getElementById('auth-error-msg');
        if(d) d.style.display = 'none';
    },

    async authenticate(authData) {
        this.playerId = authData.playerId;
        this.token = authData.token;
        this.userTag = authData.userTag;

        localStorage.setItem('grimoire_player_id', this.playerId);
        localStorage.setItem('grimoire_token', this.token);
        localStorage.setItem('grimoire_tag', this.userTag);

        await Storage.fetchPlayerCharacters(this.playerId);
        this.loadDashboard();
    },

    logout() {
        this.playerId = null;
        this.token = null;
        this.userTag = null;
        localStorage.removeItem('grimoire_player_id');
        localStorage.removeItem('grimoire_token');
        localStorage.removeItem('grimoire_tag');
        UI.showView('view-login');
    },

    async loadDashboard() {
        UI.showView('view-dashboard');

        const userData = Storage.getUserData(this.playerId);
        
        UI.renderDashboard(userData, Storage.data.sessions);
        this.filterHeroes();
        this.refreshSessionList();

        const codiceContent = document.getElementById('codice-content');
        if (codiceContent) {
            let authPanel = document.getElementById('auth-panel');
            if(!authPanel) {
                authPanel = document.createElement('div');
                authPanel.id = 'auth-panel';
                codiceContent.prepend(authPanel);
            }
            authPanel.innerHTML = `
                <div class="glass-panel" style="margin-bottom: 20px; text-align: center; border-color: var(--clr-gold);">
                    <div style="color: var(--clr-gold); font-size: 0.8rem; letter-spacing: 1px;">IDENTIDADE ARCANA</div>
                    <h3 style="margin: 5px 0;">${this.userTag}</h3>
                    <div style="font-family: monospace; font-size: 0.65rem; opacity: 0.6; word-break: break-all; margin: 5px 0;">ID: ${this.playerId}</div>
                    <button id="btn-copy-id" class="grimoire-btn-icon" style="font-size: 0.7rem; margin-top: 5px;">📜 Copiar ID</button>
                    <button onclick="window.app.logout()" class="grimoire-btn-icon" style="font-size: 0.7rem; color: #ff6666;">🚪 Sair</button>
                </div>
            `;
            setTimeout(() => {
                document.getElementById('btn-copy-id').onclick = () => {
                    navigator.clipboard.writeText(this.playerId);
                    alert("PLAYER ID Copiado!");
                };
            }, 100);
        }

        const saveBtn = document.getElementById('btn-save-character');
        if (saveBtn) saveBtn.onclick = () => this.saveCharacter();
    },

    async filterHeroes() {

        const allChars = Object.values(Storage.data.characters);
        const myChars = allChars.filter(c => c.playerId === this.playerId);
        
        const filter = document.getElementById('char-filter-class')?.value || 'all';
        const filtered = myChars.filter(c => filter === 'all' || c.class === filter);
        
        UI.renderCharacterList(filtered);
    },

    refreshSessionList() {
        UI.renderSessionList(Storage.data.sessions);
    },

    async createSession() {
        const id = await Storage.createSession(this.playerId);
        this.enterSession(id);
    },

    joinSession() {
        const key = prompt("Digite a Chave da Mesa (ID):");
        if (key && Storage.data.sessions[key]) {
            this.enterSession(key);
        } else if (key) {
            alert("Mesa não encontrada no registro arcano.");
        }
    },

    async enterSession(id) {
        this.currentSessionKey = id;
        UI.showView('view-session');
        UI.renderCodice('session');

        Network.connect(id, (msg) => this.handleNetworkEvent(msg));

        const allChars = Object.values(Storage.data.characters);
        const char = allChars.find(c => c.playerId === this.playerId); // Demo: Load active character
        
        if (char) {
            await GameEngine.init(char);
            this.syncSessionStats({ hp: char.hpCurrent, ac: char.ac });
        }

        this.refreshSession();
        this.renderSessionLog();
    },

    handleNetworkEvent(msg) {
        console.log("Evento Remoto recebido:", msg);
        if (msg.type === 'SYNC_CHAT') {
            this.refreshSession();
        }
        if (msg.type === 'SYNC_MAP') {
            if (this.mapInstance) {
                this.mapInstance.tokens = msg.tokens;
            }
        }
        if (msg.type === 'SYNC_SHEET') {

            if (msg.character && msg.character.id) {
                Storage.data.characters[msg.character.id] = msg.character;
                if (this.editingCharId === msg.character.id) {
                    UI.renderSheet(msg.character);
                }
            }
        }
        if (msg.type === 'SYNC_AUDIO') {
            if (msg.action === 'play') SoundEngine.playTrack(msg.track);
            if (msg.action === 'stop') SoundEngine.stopBGM();
            if (msg.action === 'sfx') SoundEngine.playSFX(msg.track);
        }
        if (msg.type === 'SYNC_DICE') {
            DiceEngine.roll(msg.result, msg.isCritical);
        }
    },

    leaveSession() {
        this.currentSessionKey = null;
        UI.showView('view-dashboard');
        UI.renderCodice('player');
    },

    async refreshSession() {
        if (!this.currentSessionKey) return;
        const session = Storage.data.sessions[this.currentSessionKey];
        const isMaster = session.masterId === this.playerId;
        
        const dmBtn = document.getElementById('btn-open-dm-panel');
        if (dmBtn) {
            dmBtn.style.display = isMaster ? 'block' : 'none';
            dmBtn.onclick = () => this.openDMPanel();
        }

        UI.renderSessionDiary(session.logs);
        
        let content = `<div class="panel glass-panel" style="text-align:center; padding:10px;">
            Mesa Ativa: <strong>${session.id}</strong> | Você é o **${isMaster?'MESTRE':'JOGADOR'}**
        </div>`;

        if (isMaster) {
            content += `
                <div class="dm-controls" style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:10px;">
                    <button onclick="window.app.pushCD(10)" class="grimoire-btn" style="font-size:9px;">CD 10 (FÁCIL)</button>
                    <button onclick="window.app.pushCD(15)" class="grimoire-btn" style="font-size:9px;">CD 15 (MÉDIO)</button>
                    <button onclick="window.app.resetMapFog()" class="grimoire-btn" style="font-size:9px; border-color:#2ecc71;">RESET NÉVOA</button>
                    <button onclick="window.app.resetMapTokens()" class="grimoire-btn" style="font-size:9px; border-color:#e74c3c;">VRESET MAPA</button>
                </div>
                
                <div class="glass-panel" style="margin-top:10px; padding:10px; text-align:center;">
                    <h4 style="font-size:9px; margin-bottom:5px;">AURA SONORA</h4>
                    <div style="display:flex; gap:5px; justify-content:center;">
                        <button onclick="window.app.broadcastAudio('play', 'tavern')" class="grimoire-btn" style="font-size:8px; flex:1;">🍺 Taverna</button>
                        <button onclick="window.app.broadcastAudio('play', 'combat')" class="grimoire-btn" style="font-size:8px; flex:1; border-color:#e74c3c;">⚔️ Combate</button>
                        <button onclick="window.app.broadcastAudio('play', 'exploration')" class="grimoire-btn" style="font-size:8px; flex:1;">🌲 Caverna</button>
                    </div>
                </div>`;
        }

        content += `<div class="initiative-tracker glass-panel" style="margin-top:1rem; padding:10px;">
            <h4 style="font-size:10px; color:var(--clr-gold);">RASTRADOR DE INICIATIVA</h4>
            <div id="init-list" style="margin-top:5px;">
                ${session.initiative.sort((a,b)=>b.val-a.val).map(i => `<div class="list-item" style="font-size:10px;"><span>${i.name}</span><strong>${i.val}</strong></div>`).join('') || '<small>Vazio...</small>'}
            </div>
            ${isMaster ? `
                <div style="display:flex; gap:2px; margin-top:10px;">
                    <input id="init-n" placeholder="Nome" class="grimoire-input" style="flex:2; font-size:9px;">
                    <input id="init-v" type="number" placeholder="Roll" class="grimoire-input" style="flex:1; font-size:9px;">
                    <button onclick="window.app.addInit()" class="grimoire-btn" style="font-size:9px;">+</button>
                </div>
            `:''}
        </div>`;

        document.getElementById('session-content').innerHTML = content;
    },

    broadcastAudio(action, track) {

        if (action === 'play') SoundEngine.playTrack(track);
        if (action === 'stop') SoundEngine.stopBGM();
        if (action === 'sfx') SoundEngine.playSFX(track);
        
        Network.broadcast('SYNC_AUDIO', { action, track });
    },

    async addDiaryNote() {
        const input = document.getElementById('diary-input');
        if (!input.value || !this.currentSessionKey) return;
        const msg = Security.sanitize(input.value);
        
        await Storage.addLog(this.currentSessionKey, msg, this.userTag);

        Network.broadcast('SYNC_CHAT', { author: this.userTag, message: msg });
        
        input.value = '';
        this.refreshSession();
    },

    async pushCD(val) {
        await Storage.addLog(this.currentSessionKey, `⚜️ Desafio lançado pelo Mestre: **CD ${val}**`, 'SISTEMA', 'system');
        this.refreshSession();
    },

    async rollD20() {
        const val = Math.floor(Math.random() * 20) + 1;
        const color = val === 1 ? '#ff4444' : (val === 20 ? '#E5C100' : '#B89B4B');
        const isCritical = (val === 20);
        const msg = `🎲 **Ritual de Dado:** <span style="color:${color}; font-weight:bold;">${val}</span>`;
        await Storage.addLog(this.currentSessionKey, msg, this.userTag, 'system');

        this.broadcastAudio('sfx', 'dice');

        DiceEngine.roll(val, isCritical);

        Network.broadcast('SYNC_DICE', { result: val, isCritical });
        Network.broadcast('SYNC_CHAT', { author: this.userTag, message: msg });
        
        this.refreshSession();
    },

    async addInit() {
        const n = document.getElementById('init-n').value;
        const v = parseInt(document.getElementById('init-v').value);
        if(!n || isNaN(v)) return;
        const session = Storage.data.sessions[this.currentSessionKey];
        session.initiative.push({ name: n, val: v });
        await Storage.saveSession(this.currentSessionKey, session);
        this.refreshSession();
    },

    
    renderSessionLog() {
        const log = document.getElementById('session-log');
        if (!log) return;
        log.innerHTML = '';
        GameEngine.session.log.forEach(entry => this.addPacketToLog(entry.type, entry.content));
    },

    addPacketToLog(type, content) {
        const log = document.getElementById('session-log');
        if (!log) return;

        const packet = document.createElement('div');
        packet.className = `game-packet packet-${type}`;
        
        if (type === 'dm') {
            packet.innerHTML = `
                <div style="color:var(--clr-gold); font-size:0.7rem; margin-bottom:5px; font-weight:bold; letter-spacing:1px;">MAESTRO IA</div>
                <div class="packet-narrative">${content.narrativa}</div>
                <div class="packet-mechanic" style="font-size:0.7rem; margin-top:10px; color:var(--clr-gold); opacity:0.8; font-family:monospace;">🎲 ${content.mecanica}</div>
                <div class="packet-consequence" style="font-size:0.7rem; font-style:italic; border-top:1px solid rgba(255,255,255,0.1); margin-top:5px; padding-top:5px; color:var(--clr-gold-light);">${content.consequencia}</div>
            `;
        } else {
            packet.innerHTML = `
                <div style="color:var(--clr-gold-glow); font-size:0.7rem; margin-bottom:5px; font-weight:bold;">VOCÊ (P-01)</div>
                <div style="color:var(--clr-scroll);">${content}</div>
            `;
        }

        log.appendChild(packet);
        log.scrollTop = log.scrollHeight;

        if (type === 'dm') SoundEngine.playSFX('arcane');
        else SoundEngine.playSFX('click');
    },

    syncSessionStats(update) {
        if (!update) return;
        if (update.hp) document.getElementById('mini-hp').innerText = `${update.hp}/12`;
        if (update.ac) document.getElementById('mini-ac').innerText = `${update.ac}`;
        
        if (update.xp) {
            console.log("XP Atualizado via Live Session:", update.xp);

        }
    },

    openSheet(id = null) {
        this.editingCharId = id;
        UI.showView('view-sheet');
        const char = id ? Storage.data.characters[id] : {};
        UI.renderSheet(char);
    },

    updateBuilderPreview() {
        const charData = {
            name: document.getElementById('builder-name')?.value,
            race: document.getElementById('builder-race')?.value,
            class: document.getElementById('builder-class')?.value,
            background: document.getElementById('builder-bg')?.value,
            xp: parseInt(document.getElementById('builder-xp')?.value || 0),
            attributes: {},
            level: 1
        };

        charData.level = CharacterLogic.calculateLevel(charData.xp);
        const stats = CharacterLogic.calculateLevelStats(charData);
        charData.hpMax = charData.hpCurrent = stats.hpMax;

        const classInfo = GameData.classes[charData.class];
        const raceInfo = GameData.races[charData.race];

        const levelPreview = document.getElementById('level-preview');
        if (levelPreview) {
            const nextXp = GameData.xpTable[charData.level];
            levelPreview.innerText = nextXp ? `Próximo Nível: ${nextXp} XP` : 'Nível Máximo Alcançado';
        }

        const advice = document.getElementById('builder-advice');
        if (advice && classInfo) {
            advice.innerHTML = `<strong>Dica Arcaica:</strong> ${classInfo.desc}<br><br>Priorize: <span style="color:var(--clr-gold);">${classInfo.primary.join(', ').toUpperCase()}</span>.`;
        }

        document.querySelectorAll('.attr-input-group').forEach(group => {
            const input = group.querySelector('input');
            if (input) {
                const attr = input.id.replace('builder-attr-', '');
                if (classInfo?.primary.includes(attr)) {
                    group.classList.add('recommended-glow');
                } else {
                    group.classList.remove('recommended-glow');
                }
            }
        });

        document.querySelectorAll('.attr-field').forEach(f => {
            const attr = f.id.replace('builder-attr-', '');
            charData.attributes[attr] = parseInt(f.value) || 10;
        });

        if (raceInfo && raceInfo.bonuses) {
            Object.keys(raceInfo.bonuses).forEach(a => {
                charData.attributes[a] += raceInfo.bonuses[a];
            });
        }

        const cardTarget = document.getElementById('hero-card-preview');
        const sheetTarget = document.getElementById('hero-sheet-preview');
        if (cardTarget) cardTarget.innerHTML = UI.CharacterSheet.renderCard(charData);
        if (sheetTarget) sheetTarget.innerHTML = UI.CharacterSheet.renderSheet(charData);
    },

    generateAIBio() {
        const charData = {
            race: document.getElementById('builder-race').value,
            class: document.getElementById('builder-class').value,
            level: CharacterLogic.calculateLevel(parseInt(document.getElementById('builder-xp').value || 0))
        };
        const bio = CharacterLogic.generateBackstory(charData);
        const textarea = document.getElementById('builder-bg');
        if (textarea) {
            textarea.value = bio;
            this.updateBuilderPreview();
            this.broadcastAudio('sfx', 'arcane');
        }
    },

    rollBuilderStats() {
        const stats = CharacterLogic.rollAllAttributes();
        Object.keys(stats).forEach(s => {
            const input = document.getElementById(`builder-attr-${s}`);
            if (input) input.value = stats[s];
        });
        this.updateBuilderPreview();
        this.broadcastAudio('sfx', 'dice');
    },

    async saveCharacter() {
        const charData = {
            id: this.editingCharId,
            name: document.getElementById('builder-name').value,
            race: document.getElementById('builder-race').value,
            class: document.getElementById('builder-class').value,
            background: document.getElementById('builder-bg').value,
            xp: parseInt(document.getElementById('builder-xp').value || 0),
            attributes: {},
            level: 1,
            hpCurrent: 10,
            hpMax: 10,
            ac: 10,
            initiative: 0,
            proficiencies: [],
            inventory: [
                { name: 'Espada Longa', weight: 3, type: 'martial' },
                { name: 'Cota de Malha', weight: 55, type: 'heavy', ac: 16 }
            ], // Initial starting gear for AAA demo
            features: "Nenhuma característica especial registrada."
        };

        document.querySelectorAll('.attr-field').forEach(f => {
            const attr = f.id.replace('builder-attr-', '');
            charData.attributes[attr] = parseInt(f.value);
        });

        charData.level = CharacterLogic.calculateLevel(charData.xp);
        const stats = CharacterLogic.calculateLevelStats(charData);
        charData.hpMax = charData.hpCurrent = stats.hpMax;
        charData.ac = CharacterLogic.calculateAC(charData);
        charData.initiative = CharacterLogic.getModifier(charData.attributes.des);

        try {
            await Storage.saveCharacter(this.playerId, charData);

            Network.broadcast('SYNC_SHEET', { character: charData });
            
            this.loadDashboard();
        } catch (e) {
            alert(e.message);
        }
    },


    async showSRD(category) {
        if (!this.srdData) {
            const r = await fetch('./rules_srd.json');
            this.srdData = await r.json();
        }
        UI.renderSRD(this.srdData, category);
    },

    addItemToSheet(category, name) {
        console.log(`Adicionando ${name} ao inventário...`);

        UI.closeModal();
    },

    handleDropOnSheet(event, targetId) {
        event.preventDefault();
        try {
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            if (!this.srdData || !this.srdData[data.category]) return;
            
            const item = this.srdData[data.category].find(i => i.name === data.item);
            if (item) {
                const targetArea = document.getElementById(targetId);
                const desc = item.properties || item.desc || `Dano: ${item.damage}`;
                targetArea.value += `\n[${item.name.toUpperCase()}] - ${desc}`;
            }
        } catch (e) {
            console.error("Erro ao processar item do compêndio", e);
        }
    },

    setCodiceMode(mode) {
        UI.renderCodice(mode);
    },

    openMap() {
        const session = Storage.data.sessions[this.currentSessionKey];
        UI.openModal(`<canvas id="tactical-canvas" width="800" height="600" style="width:100%; border:1px solid var(--clr-gold);"></canvas>`);
        this.mapInstance = new TacticalMap('tactical-canvas', session.mapTokens || [], async (tokens) => {
            session.mapTokens = tokens;
            await Storage.saveSession(this.currentSessionKey, session);

            Network.broadcast('SYNC_MAP', { tokens });
        });
    },

    openDMPanel() {
        const session = Storage.data.sessions[this.currentSessionKey];
        // In a real scenario, we would fetch connected players from the backend
        // For now, let's mock with current session characters
        const players = Object.values(Storage.data.characters).filter(c => c.playerId !== this.playerId);
        
        UI.openModal('<div id="dm-control-panel"></div>');
        UI.renderDMDashboard(session, players);
        
        // Ensure SRD is loaded for monster search
        if (!this.srdData) this.showSRD('monsters');
    },

    resetMapFog() { if(this.mapInstance) this.mapInstance.resetFog(); },
    resetMapTokens() { if(this.mapInstance) this.mapInstance.resetTokens(); },

    searchMonsters(query) {
        if (!this.srdData || !query) return;
        const results = this.srdData.monsters.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
        const target = document.getElementById('monster-results');
        if (target) {
            target.innerHTML = results.map(m => `
                <div class="list-item" style="font-size:11px; cursor:pointer;" onclick="window.app.spawnMonster('${m.name}')">
                    <b>${m.name}</b> (CR ${m.cr}) - HP ${m.hp}
                </div>
            `).join('') || '<p style="font-size:10px; opacity:0.5;">Nenhuma criatura invocada...</p>';
        }
    },

    spawnMonster(name) {
        const monster = this.srdData.monsters.find(m => m.name === name);
        if (!monster || !this.mapInstance) return;
        
        const token = {
            id: 'monster-' + Date.now(),
            name: monster.name,
            x: 100, y: 100,
            color: '#ff4444'
        };
        
        this.mapInstance.tokens.push(token);
        Network.broadcast('SYNC_MAP', { tokens: this.mapInstance.tokens });
        alert(`${monster.name} invocado no mapa!`);
    },

    applyDamage(playerId, amount) {
        Network.broadcast('SYNC_DAMAGE', { playerId, amount });
        // Local feedback
        console.log(`Damage applied: ${amount} to ${playerId}`);
    }
};

window.app = App;
window.onload = () => App.init();

