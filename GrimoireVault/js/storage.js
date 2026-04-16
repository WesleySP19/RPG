const STORAGE_KEY = 'GRIMOIRE_VAULT_DATA_ENCRYPTED';
const SALT_DB = 'DND_GRIMOIRE_2026_STORAGE_SALT';
const DB_NAME = 'GrimoireVaultDB';
const STORE_NAME = 'vault_store';

export const Storage = {
    data: {
        users: {},
        sessions: {},
        tavernBoard: []
    },
    cryptoKey: null,
    db: null,

    /**
     * Core IndexedDB Wrapper (Vanilla)
     */
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onerror = () => reject('Erro ao abrir IndexedDB');
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    },

    async dbGet(key) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
        });
    },

    async dbPut(key, val) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(val, key);
            request.onsuccess = () => resolve();
        });
    },

    async deriveKey(playerKey) {
        const encoder = new TextEncoder();
        const baseKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(playerKey),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        this.cryptoKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(SALT_DB),
                iterations: 100000,
                hash: 'SHA-256'
            },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },

    async init(playerKey = null) {
        this.db = await this.openDB();
        
        if (!playerKey) {
            const savedKey = localStorage.getItem('ACTIVE_PLAYER_KEY');
            if (savedKey) await this.deriveKey(savedKey);
            else return;
        } else {
            await this.deriveKey(playerKey);
        }

        // T5.6: Migração e Carregamento
        let encrypted = await this.dbGet(STORAGE_KEY);
        
        // Tentar migrar do localStorage se o IDB estiver vazio
        if (!encrypted) {
            const legacy = localStorage.getItem(STORAGE_KEY);
            if (legacy) {
                console.log('Migrando dados do LocalStorage para IndexedDB...');
                await this.dbPut(STORAGE_KEY, legacy);
                encrypted = legacy;
                // Opcional: localStorage.removeItem(STORAGE_KEY);
            }
        }

        if (encrypted) {
            try {
                this.data = await this.decrypt(encrypted);
                const key = playerKey || localStorage.getItem('ACTIVE_PLAYER_KEY');
                if (this.data.users[key] && !this.data.users[key].profiles) {
                    this.data.users[key].profiles = [{ name: 'Padrão', characters: [], achievements: [] }];
                    this.data.users[key].activeProfileIndex = 0;
                }
            } catch (e) {
                console.error('Falha na descriptografia. Chave inválida?');
                this.data = { users: {}, sessions: {}, tavernBoard: [] };
            }
        }
    },

    async save() {
        if (!this.cryptoKey) return;
        const encrypted = await this.encrypt(this.data);
        await this.dbPut(STORAGE_KEY, encrypted);
    },

    async encrypt(obj) {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = encoder.encode(JSON.stringify(obj));

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            this.cryptoKey,
            encodedData
        );

        // Result: IV (12 bytes) + Ciphertext
        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(ciphertext), iv.length);

        return btoa(String.fromCharCode(...combined));
    },

    async decrypt(base64) {
        const combined = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const decodedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            this.cryptoKey,
            ciphertext
        );

        return JSON.parse(new TextDecoder().decode(decodedData));
    },

    /**
     * Key Logic (Legacy compatibility for generation)
     */
    generatePlayerKey(identifier) {
        return btoa(identifier.trim().toLowerCase() + 'SAL_TEMATICO').replace(/=/g, '');
    },

    async createUser(key, identifier) {
        if (!this.data.users[key]) {
            this.data.users[key] = { 
                identifier, 
                profiles: [{ name: 'Aventureiro Padrão', characters: [], achievements: [] }],
                activeProfileIndex: 0
            };
            await this.save();
        }
    },

    getActiveProfile(key) {
        const user = this.data.users[key];
        if (user && user.profiles) {
            return user.profiles[user.activeProfileIndex || 0];
        }
        return null;
    },

    async saveCharacter(playerKey, charData) {
        const profile = this.getActiveProfile(playerKey);
        if (profile) {
            if (!charData.id) charData.id = 'char_' + Date.now();
            const idx = profile.characters.findIndex(c => c.id === charData.id);
            if (idx > -1) profile.characters[idx] = charData;
            else profile.characters.push(charData);
            await this.save();
        }
    },

    async unlockAchievement(playerKey, title) {
        const profile = this.getActiveProfile(playerKey);
        if (profile && !profile.achievements.includes(title)) {
            profile.achievements.push(title);
            await this.save();
            return true;
        }
        return false;
    },

    async createSession(masterKey) {
        const key = 'D&D-' + Math.random().toString(36).substring(2,6).toUpperCase();
        this.data.sessions[key] = { masterKey, players: {}, logs: [] };
        await this.save();
        return key;
    },

    async addLog(sessionKey, message, author, type) {
        const s = this.data.sessions[sessionKey];
        if (s) {
            s.logs.push({ author, message, timestamp: new Date().toISOString(), type });
            await this.save();
        }
    },

    async addTavernPost(message, author) {
        if (!this.data.tavernBoard) this.data.tavernBoard = [];
        this.data.tavernBoard.push({ author, message, timestamp: new Date().toISOString() });
        // Keep only last 20 posts
        if (this.data.tavernBoard.length > 20) this.data.tavernBoard.shift();
        await this.save();
    },

    async saveMapState(sessionKey, tokens) {
        const s = this.data.sessions[sessionKey];
        if (s) {
            s.mapState = tokens;
            await this.save();
        }
    }
};
