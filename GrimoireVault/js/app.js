import { Storage } from './storage.js';
import { UI } from './ui.js';
import { TacticalMap } from './map.js';
import { State } from './state.js';
import { Sync } from './sync.js';
import { SheetManager } from './modules/sheet_manager.js';
import { SessionController } from './modules/session_controller.js';
import { SRDBrowser } from './modules/srd_browser.js';

const XP_THRESHOLDS = {
    1: [25, 50, 75, 100], 2: [50, 100, 150, 200], 3: [75, 150, 225, 400],
    4: [125, 250, 375, 500], 5: [250, 500, 750, 1100]
};

const App = {
    currentPlayerKey: null,
    editingCharId: null,
    currentSessionKey: null,
    activeMap: null,
    searchTimeout: null,

    init() {
        this.setupEventListeners();
        this.checkAuth();
        
        State.subscribe((path, value) => {
            if (path.startsWith('users') || path === 'tavernBoard') {
                this.refreshDashboard();
            }
            if (path.startsWith('sessions')) {
                if (this.currentSessionKey) SessionController.refresh(this.currentSessionKey, this);
            }
        });
    },

        document.getElementById('btn-login').addEventListener('click', async () => {
            const ident = document.getElementById('identificador').value;
            if (ident) {
                const key = Storage.generatePlayerKey(ident);
                document.getElementById('access-key-output').textContent = key;
                document.getElementById('key-display').style.display = 'block';
                await Storage.init(key);
                await Storage.createUser(key, ident);
            }
        });

        document.getElementById('btn-copy-key').addEventListener('click', () => {
            const key = document.getElementById('access-key-output').textContent;
            navigator.clipboard.writeText(key).then(() => alert('Chave copiada!'));
        });

        document.getElementById('btn-enter').addEventListener('click', async () => {
            const key = document.getElementById('access-key-output').textContent;
            await this.login(key);
        });

        // --- DASHBOARD VIEW ---
        document.getElementById('btn-logout').addEventListener('click', () => {
            localStorage.removeItem('ACTIVE_PLAYER_KEY');
            location.reload();
        });

        document.getElementById('btn-new-char').addEventListener('click', () => {
            this.editingCharId = null;
            document.getElementById('sheet-content').innerHTML = UI.renderCharacterForm();
            UI.showView('view-sheet');
        });

        document.getElementById('btn-create-session').addEventListener('click', () => SessionController.create(this));
        document.getElementById('btn-join-session').addEventListener('click', () => SessionController.join(this));
        document.getElementById('btn-sync-qr').addEventListener('click', () => this.showSyncOptions());

        // --- SESSION VIEW ---
        document.getElementById('btn-add-note').addEventListener('click', () => SessionController.addNote(this));
        document.getElementById('btn-open-srd').addEventListener('click', () => SRDBrowser.show(this));
        document.getElementById('btn-open-map').addEventListener('click', () => this.showMap());
        document.getElementById('btn-leave-session').addEventListener('click', () => UI.showView('view-dashboard'));
        document.getElementById('btn-back-dashboard').addEventListener('click', () => UI.showView('view-dashboard'));

        // Event Delegation
        document.body.addEventListener('click', async (e) => {
            if (e.target.id === 'btn-save-char') await SheetManager.save(this);
            if (e.target.classList.contains('tab-btn')) this.switchTab(e.target);
            if (e.target.classList.contains('srd-filter')) {
                SRDBrowser.setFilter(e.target.dataset.filter);
            }
            
            if (e.target.id === 'btn-add-token-pc') this.activeMap?.addToken('PC', '#B89B4B');
            if (e.target.id === 'btn-add-token-npc') this.activeMap?.addToken('Orc', '#D0021B');
            if (e.target.id === 'btn-clear-map') this.activeMap?.clear();
            if (e.target.id === 'btn-gen-encounter') this.showEncounterGenerator();
            if (e.target.id === 'btn-calc-encounter') this.calculateEncounter();
            if (e.target.id === 'btn-hidden-roll') this.hiddenRoll();
            if (e.target.id === 'btn-send-whisper') await this.sendWhisper();
            
            if (e.target.id === 'btn-add-tavern') await this.addTavernPost();
            if (e.target.id === 'btn-open-homebrew') this.showHomebrew();
            if (e.target.id === 'btn-save-homebrew') this.saveHomebrew();
            if (e.target.id === 'btn-voice-roll') this.startVoiceCommand();
        });

        document.body.addEventListener('input', (e) => {
            if (e.target.id === 'srd-search') {
                this.debounce(() => SRDBrowser.update(), 300);
            }
            if (e.target.id === 'srd-level-filter') {
                SRDBrowser.setLevel(e.target.value);
            }
            if (e.target.classList.contains('attr-trigger')) {
                SheetManager.handleAttributeChange(e.target);
            }
        });
    },

    async login(key) {
        this.currentPlayerKey = key;
        localStorage.setItem('ACTIVE_PLAYER_KEY', key);
        await Storage.init(key);
        await State.syncFromStorage(); // Sync State with Storage after init
        this.refreshDashboard();
        UI.showView('view-dashboard');
    },

    async checkAuth() {
        const saved = localStorage.getItem('ACTIVE_PLAYER_KEY');
        if (saved) await this.login(saved);
    },

    async refreshDashboard() {
        const user = Storage.data.users[this.currentPlayerKey];
        const profile = Storage.getActiveProfile(this.currentPlayerKey);
        if (user && profile) {
            // Load character objects from IDs
            const characterObjects = await Promise.all(
                profile.characters.map(id => typeof id === 'string' ? Storage.getCharacter(id) : id)
            );
            const validCharacters = characterObjects.filter(c => c);

            document.getElementById('character-list').innerHTML = UI.renderCharacterList(validCharacters);
            const achvHtml = profile.achievements.length > 0 
                ? profile.achievements.map(a => `<span style="font-size:0.5rem; background:var(--clr-gold); padding:1px 4px; margin-right:2px; color:black; border-radius:2px;">${a}</span>`).join('')
                : '<span style="opacity:0.4; font-size:0.6rem;">Nenhuma conquista...</span>';
            
            const header = `<div style="margin-bottom:1rem; border-bottom:1px solid var(--clr-gold); padding-bottom:0.5rem;">
                <h4 style="font-size:0.8rem;">Persona: ${profile.name}</h4>
                <div style="margin-top:4px;">${achvHtml}</div>
            </div>`;
            document.getElementById('character-list').insertAdjacentHTML('afterbegin', header);

            const sessions = Storage.data.sessions;
            const list = Object.keys(sessions).filter(k => sessions[k].masterKey === this.currentPlayerKey || sessions[k].players[this.currentPlayerKey]);
            const filteredSessions = {};
            list.forEach(k => filteredSessions[k] = sessions[k]);
            document.getElementById('session-list').innerHTML = UI.renderSessionList(filteredSessions);

            // Render Tavern
            document.getElementById('tavern-board').innerHTML = UI.renderTavern(Storage.data.tavernBoard);
        }
    },

    async addTavernPost() {
        const input = document.getElementById('tavern-input');
        if (input.value.trim()) {
            const profile = Storage.getActiveProfile(this.currentPlayerKey);
            await Storage.addTavernPost(input.value, profile.name);
            input.value = '';
        }
    },

    showHomebrew() {
        document.getElementById('modal-inner').innerHTML = UI.renderHomebrewBuilder();
        document.getElementById('modal-overlay').style.display = 'flex';
    },

    saveHomebrew() {
        const name = document.getElementById('hb-name').value;
        const desc = document.getElementById('hb-desc').value;
        if (name) {
            this.generateQR(JSON.stringify({ type: 'homebrew', name, desc }));
            alert('Homebrew forjado! Escaneie o QR para compartilhar.');
        }
    },

    debounce(func, wait) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(func, wait);
    },

    switchTab(btn) {
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    },

    async openChar(id) { await SheetManager.open(id, this); },
    async editChar(id) { await SheetManager.edit(id, this); },
    async enterSession(key) { await SessionController.enter(key, this); },
    async confirmJoin(charId) {
        if (await Storage.joinSession(this.pendingSessionKey, this.currentPlayerKey, charId)) {
            document.getElementById('modal-overlay').style.display = 'none';
            await this.enterSession(this.pendingSessionKey);
        } else {
            alert('Falha ao ingressar.');
        }
    },

    showMap() {
        if (!this.currentSessionKey) return alert('Entre em uma mesa primeiro!');
        const session = Storage.data.sessions[this.currentSessionKey];
        const initialState = session.mapState || [];
        
        document.getElementById('modal-inner').innerHTML = UI.renderMapContainer();
        document.getElementById('modal-overlay').style.display = 'flex';
        
        setTimeout(() => {
            this.activeMap = new TacticalMap(
                'tactical-canvas', 
                initialState, 
                (tokens) => Storage.saveMapState(this.currentSessionKey, tokens)
            );
        }, 100);
    },

    showEncounterGenerator() {
        document.getElementById('modal-inner').innerHTML = UI.renderEncounterGenerator(SRDBrowser.srdData?.monsters || []);
        document.getElementById('modal-overlay').style.display = 'flex';
    },

    calculateEncounter() {
        const size = parseInt(document.getElementById('group-size').value);
        const level = parseInt(document.getElementById('group-level').value);
        const budget = (XP_THRESHOLDS[level] || XP_THRESHOLDS[1])[1] * size;
        const monsters = SRDBrowser.srdData?.monsters || [];
        const suggestion = monsters.filter(m => (parseInt(m.cr) * 100 || 50) <= budget);
        if (suggestion.length > 0) {
            const s = suggestion[Math.floor(Math.random() * suggestion.length)];
            document.getElementById('encounter-result').innerHTML = `<p><strong>${s.name}</strong> (XP: ${budget})</p>`;
        }
    },

    hiddenRoll() {
        const r = Math.floor(Math.random() * 20) + 1;
        alert(`O Mestre lançou os dados em segredo... Resultado: ${r}`);
        Storage.addLog(this.currentSessionKey, '🎲 O Mestre realizou uma rolagem oculta.', 'Mestre', 'secret');
    },

    startVoiceCommand() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return alert('Voz não suportada.');

        const recognition = new Speech();
        recognition.lang = 'pt-BR';
        recognition.start();

        alert('Ouvindo comando (ex: "rolar dados")...');
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.toLowerCase();
            if (transcript.includes('rolar') || transcript.includes('dados')) {
                const res = Math.floor(Math.random() * 20) + 1;
                alert(`🎲 Rolagem de Voz: ${res}!`);
            }
        };
    },

    async sendWhisper() {
        const msg = prompt('Sussurro:');
        if (msg) {
            await Storage.addLog(this.currentSessionKey, `🤫 [Sussurro]: ${msg}`, 'Mestre', 'whisper');
        }
    },

    generateQR(text) {
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();
        document.getElementById('qr-result').innerHTML = qr.createImgTag(4);
    },

    showSyncOptions() {
        document.getElementById('modal-inner').innerHTML = `
            <h3>Sincronização QR</h3>
            <div style="display:flex; gap:1rem; justify-content:center; margin:1rem 0;">
                <button id="btn-qr-exp" class="grimoire-btn">Exportar</button>
                <button id="btn-qr-imp" class="grimoire-btn">Escanear</button>
            </div>
            <div id="qr-result" style="display:flex; justify-content:center;"></div>
        `;
        document.getElementById('modal-overlay').style.display = 'flex';
        document.getElementById('btn-qr-exp').onclick = () => this.generateQR(JSON.stringify({ key: this.currentPlayerKey, ...Storage.data.users[this.currentPlayerKey] }));
        document.getElementById('btn-qr-imp').onclick = () => this.startScanner();
    },

    async startScanner() {
        const video = document.createElement('video');
        video.setAttribute('id', 'qr-video');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.play();
            document.getElementById('modal-inner').innerHTML = `<canvas id="qr-canvas" style="width:100%"></canvas>`;
            const canvasElement = document.getElementById('qr-canvas');
            const canvas = canvasElement.getContext('2d');
            const tick = () => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvasElement.width = video.videoWidth;
                    canvasElement.height = video.videoHeight;
                    canvas.drawImage(video, 0, 0);
                    const code = jsQR(canvas.getImageData(0,0,canvasElement.width,canvasElement.height).data, canvasElement.width, canvasElement.height);
                    if (code) {
                        this.processQR(code.data);
                        stream.getTracks().forEach(t => t.stop());
                    } else if (document.getElementById('modal-overlay').style.display === 'flex') requestAnimationFrame(tick);
                } else requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } catch(e) { alert('Erro ao acessar câmera: ' + e); }
    },

    async processQR(text) {
        try {
            const data = JSON.parse(text);
            if (data.key) {
                Storage.data.users[data.key] = data;
                await Storage.save('users', data.key, data);
                await this.login(data.key);
                document.getElementById('modal-overlay').style.display = 'none';
            }
        } catch(e) { alert('QR Inválido'); }
    }
};

window.app = App;
App.init();


window.app = App;
App.init();
