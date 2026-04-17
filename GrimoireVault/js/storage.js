const SALT_DB = 'DND_GRIMOIRE_2026_STORAGE_SALT';
const DB_NAME = 'GrimoireVaultDB';
const LEGACY_STORAGE_KEY = 'GRIMOIRE_VAULT_DATA_ENCRYPTED';

export const Storage = {
    data: {
        users: {},
        sessions: {},
        tavernBoard: []
    },
    cryptoKey: null,
    db: null,

    /**
     * Core IndexedDB Wrapper (Fragmented Version)
     */
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2); // Version 2
            request.onerror = () => reject('Erro ao abrir IndexedDB');
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // Create stores if they don't exist
                if (!db.objectStoreNames.contains('users')) db.createObjectStore('users');
                if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions');
                if (!db.objectStoreNames.contains('characters')) db.createObjectStore('characters');
                if (!db.objectStoreNames.contains('tavern')) db.createObjectStore('tavern');
                if (!db.objectStoreNames.contains('vault_store')) db.createObjectStore('vault_store'); // Keep for migration
            };
        });
    },

    async dbGet(storeName, key) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    },

    async dbPut(storeName, key, val) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(val, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    },

    async dbGetAll(storeName) {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            const keysRequest = store.getAllKeys();
            
            // Note: In some browsers, we need to map keys to values manualy if not using keyPath
            request.onsuccess = () => {
                keysRequest.onsuccess = () => {
                    const result = {};
                    request.result.forEach((val, i) => {
                        result[keysRequest.result[i]] = val;
                    });
                    resolve(result);
                };
            };
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
        
        const activeKey = playerKey || localStorage.getItem('ACTIVE_PLAYER_KEY');
        if (activeKey) {
            await this.deriveKey(activeKey);
        } else {
            return;
        }

        // --- CHECK FOR MIGRATION ---
        const legacyEncrypted = await this.dbGet('vault_store', LEGACY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyEncrypted) {
            await this.migrateLegacyData(legacyEncrypted);
        }

        // --- LOAD DATA (Fragmented) ---
        await this.loadAll();
    },

    async migrateLegacyData(encrypted) {
        console.log('Iniciando migração de dados legado...');
        try {
            const decrypted = await this.decrypt(encrypted);
            
            // Migrate Users
            for (let k in decrypted.users) {
                await this.dbPut('users', k, decrypted.users[k]);
                // Migrate Characters from profiles if they exist
                if (decrypted.users[k].profiles) {
                    for (let profile of decrypted.users[k].profiles) {
                        if (profile.characters) {
                            for (let char of profile.characters) {
                                await this.dbPut('characters', char.id, char);
                            }
                        }
                    }
                }
            }

            // Migrate Sessions
            for (let k in decrypted.sessions) {
                await this.dbPut('sessions', k, decrypted.sessions[k]);
            }

            // Migrate Tavern
            if (decrypted.tavernBoard) {
                await this.dbPut('tavern', 'main_board', decrypted.tavernBoard);
            }

            // Cleanup
            localStorage.removeItem(LEGACY_STORAGE_KEY);
            const tx = this.db.transaction(['vault_store'], 'readwrite');
            tx.objectStore('vault_store').delete(LEGACY_STORAGE_KEY);
            console.log('Migração concluída com sucesso!');
        } catch (e) {
            console.error('Falha na migração:', e);
        }
    },

    async loadAll() {
        this.data.users = await this.dbGetAll('users');
        this.data.sessions = await this.dbGetAll('sessions');
        this.data.tavernBoard = await this.dbGet('tavern', 'main_board') || [];
        
        // Ensure profiles exist
        for (let k in this.data.users) {
            if (!this.data.users[k].profiles) {
                this.data.users[k].profiles = [{ name: 'Padrão', characters: [], achievements: [] }];
                this.data.users[k].activeProfileIndex = 0;
            }
        }
    },

    async save(category, key, value) {
        if (!this.cryptoKey) return;
        // In this fragmented version, we save specific keys
        await this.dbPut(category, key, value);
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

    generatePlayerKey(identifier) {
        return btoa(identifier.trim().toLowerCase() + 'SAL_TEMATICO').replace(/=/g, '');
    },

    async createUser(key, identifier) {
        if (!this.data.users[key]) {
            const user = { 
                identifier, 
                profiles: [{ name: 'Aventureiro Padrão', characters: [], achievements: [] }],
                activeProfileIndex: 0
            };
            this.data.users[key] = user;
            await this.save('users', key, user);
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
            
            // Save to top-level characters store
            await this.save('characters', charData.id, charData);

            // Update profile character list (store only IDs for scalability)
            if (!profile.characters.find(c => c === charData.id || c.id === charData.id)) {
                profile.characters.push(charData.id);
            }
            // Compatibility: remove old character objects from list if they exist
            profile.characters = profile.characters.map(c => typeof c === 'string' ? c : c.id);

            await this.save('users', playerKey, this.data.users[playerKey]);
        }
    },

    async getCharacter(id) {
        return await this.dbGet('characters', id);
    },

    async unlockAchievement(playerKey, title) {
        const profile = this.getActiveProfile(playerKey);
        if (profile && !profile.achievements.includes(title)) {
            profile.achievements.push(title);
            await this.save('users', playerKey, this.data.users[playerKey]);
            return true;
        }
        return false;
    },

    async createSession(masterKey) {
        const key = 'D&D-' + Math.random().toString(36).substring(2,6).toUpperCase();
        const session = { masterKey, players: {}, logs: [] };
        this.data.sessions[key] = session;
        await this.save('sessions', key, session);
        return key;
    },

    async addLog(sessionKey, message, author, type) {
        const s = this.data.sessions[sessionKey];
        if (s) {
            s.logs.push({ author, message, timestamp: new Date().toISOString(), type });
            await this.save('sessions', sessionKey, s);
        }
    },

    async addTavernPost(message, author) {
        if (!this.data.tavernBoard) this.data.tavernBoard = [];
        this.data.tavernBoard.push({ author, message, timestamp: new Date().toISOString() });
        if (this.data.tavernBoard.length > 20) this.data.tavernBoard.shift();
        await this.save('tavern', 'main_board', this.data.tavernBoard);
    },

    async saveMapState(sessionKey, tokens) {
        const s = this.data.sessions[sessionKey];
        if (s) {
            s.mapState = tokens;
            await this.save('sessions', sessionKey, s);
        }
    }
};

