/**
 * Grimoire App Entry Point
 * Orchestrating the Full Modular Experience.
 */
import { Storage } from './modules/Storage.js';
import { State } from './modules/State.js';
import { TacticalMap } from './modules/TacticalMap.js';
import { Security } from './modules/Security.js';
import { Network } from './modules/Network.js';
import { UI } from './ui.js';

const App = {
    currentPlayerKey: null,
    currentSessionKey: null,
    editingCharId: null,
    mapInstance: null,
    srdData: null,

    async init() {
        console.log("Grimório Inicializando...");
        try {
            await Storage.init();
            this.setupListeners();
            UI.renderCodice('player');
        } catch (e) {
            console.error("Falha no despertar arcano:", e);
        }
    },

    setupListeners() {
        document.getElementById('btn-login').onclick = () => {
            const secret = document.getElementById('identificador').value;
            if (!secret) return;
            const key = Security.generateKey(secret);
            document.getElementById('access-key-output').innerText = key;
            document.getElementById('key-display').style.display = 'block';
        };

        document.getElementById('btn-enter').onclick = () => {
            const key = document.getElementById('access-key-output').innerText;
            this.login(key);
        };

        document.getElementById('btn-add-note').onclick = () => this.addDiaryNote();
        document.getElementById('btn-back-dashboard').onclick = () => UI.showView('view-dashboard');
        document.getElementById('btn-leave-session').onclick = () => this.leaveSession();
        document.getElementById('btn-open-map').onclick = () => this.openMap();
        document.getElementById('btn-open-srd').onclick = () => this.showSRD('items');
        
        // PWA Installation Support
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log("PWA Pronto para Instalação");
            // Store event for a custom install button if needed
        });
    },

    async login(key) {
        this.currentPlayerKey = key;
        const profile = Storage.getActiveProfile(key);
        UI.showView('view-dashboard');
        UI.renderDashboard(profile, Storage.data.sessions);
        this.filterHeroes();
        this.refreshSessionList();
    },

    async filterHeroes() {
        const profile = Storage.getActiveProfile(this.currentPlayerKey);
        const allChars = await Promise.all(profile.characters.map(id => Storage.getCharacter(id)));
        const filter = document.getElementById('char-filter-class')?.value || 'all';
        const filtered = allChars.filter(c => c && (filter === 'all' || c.class === filter));
        UI.renderCharacterList(filtered);
    },

    refreshSessionList() {
        UI.renderSessionList(Storage.data.sessions);
    },

    async createSession() {
        const id = await Storage.createSession(this.currentPlayerKey);
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
        
        // Connect to Real-time Stream
        Network.connect(id, (msg) => this.handleNetworkEvent(msg));
        
        this.refreshSession();
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
            // Update character locally if present in the data store
            if (msg.character && msg.character.id) {
                Storage.data.characters[msg.character.id] = msg.character;
                if (this.editingCharId === msg.character.id) {
                    UI.renderSheet(msg.character);
                }
            }
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
        const isMaster = session.masterKey === this.currentPlayerKey;
        
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

    async addDiaryNote() {
        const input = document.getElementById('diary-input');
        if (!input.value || !this.currentSessionKey) return;
        const msg = Security.sanitize(input.value);
        const profile = Storage.getActiveProfile(this.currentPlayerKey);
        await Storage.addLog(this.currentSessionKey, msg, profile.name);
        
        // Broadcast to Mesh
        Network.broadcast('SYNC_CHAT', { author: profile.name, message: msg });
        
        input.value = '';
        this.refreshSession();
    },

    async pushCD(val) {
        await Storage.addLog(this.currentSessionKey, `⚜️ Desafio lançado pelo Mestre: **CD ${val}**`, 'SISTEMA', 'system');
        this.refreshSession();
    },

    async rollD20() {
        const val = Math.floor(Math.random() * 20) + 1;
        const profile = Storage.getActiveProfile(this.currentPlayerKey);
        const color = val === 1 ? '#ff4444' : (val === 20 ? '#E5C100' : '#B89B4B');
        const msg = `🎲 **Ritual de Dado:** <span style="color:${color}; font-weight:bold;">${val}</span>`;
        await Storage.addLog(this.currentSessionKey, msg, profile.name, 'system');
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

    openSheet(id = null) {
        this.editingCharId = id;
        UI.showView('view-sheet');
        const char = id ? Storage.data.characters[id] : {};
        UI.renderSheet(char);
    },

    async saveCharacter() {
        const charData = {
            id: this.editingCharId,
            name: document.getElementById('char-name').value,
            class: document.getElementById('char-class').value,
            background: document.getElementById('char-bg').value,
            race: document.getElementById('char-race').value,
            alignment: document.getElementById('char-align').value,
            ac: parseInt(document.getElementById('char-ac').value),
            hpMax: parseInt(document.getElementById('char-hp-max').value),
            hpCurrent: parseInt(document.getElementById('char-hp-current').value),
            speed: document.getElementById('char-speed').value,
            attacks: document.getElementById('char-attacks').value,
            features: document.getElementById('char-features').value,
            traits: {
                'Traços de Personalidade': document.getElementById('char-traços-de-personalidade').value,
                'Ideais': document.getElementById('char-ideais').value,
                'Ligações': document.getElementById('char-ligações').value,
                'Defeitos': document.getElementById('char-defeitos').value,
            },
            attributes: {},
            proficiencies: [], // Expansion logic for proficiencies would follow
            inventory: [] 
        };
        document.querySelectorAll('.attr-field').forEach(f => {
            charData.attributes[f.dataset.attr] = parseInt(f.value);
        });
        await Storage.saveCharacter(this.currentPlayerKey, charData);
        
        // Broadcast Sheet Update
        Network.broadcast('SYNC_SHEET', { character: charData });
        
        UI.showView('view-dashboard');
        this.login(this.currentPlayerKey);
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
        // Real implementation would update the editing character
        UI.closeModal();
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
            
            // Broadcast Map State
            Network.broadcast('SYNC_MAP', { tokens });
        });
    },

    resetMapFog() { if(this.mapInstance) this.mapInstance.resetFog(); },
    resetMapTokens() { if(this.mapInstance) this.mapInstance.resetTokens(); }
};

window.app = App;
window.onload = () => App.init();
