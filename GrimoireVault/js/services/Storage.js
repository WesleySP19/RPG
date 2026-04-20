
export const Storage = {
    db: null,
    data: {
        users: {},
        characters: {},
        sessions: {}
    },

    async init() {
        return new Promise((resolve, reject) => {

            const request = indexedDB.open("GrimoireVaultDB", 6);

            request.onerror = () => reject("Erro ao abrir Grimório");
            
            request.onsuccess = (e) => {
                this.db = e.target.result;
                this.loadAll().then(resolve);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                if (db.objectStoreNames.contains("profiles")) db.deleteObjectStore("profiles");

                if (!db.objectStoreNames.contains("users")) db.createObjectStore("users", { keyPath: "id" });

                if (!db.objectStoreNames.contains("characters")) db.createObjectStore("characters", { keyPath: "id" });
                if (!db.objectStoreNames.contains("sessions")) db.createObjectStore("sessions", { keyPath: "id" });
            };
        });
    },

    async loadAll() {
        try {
            this.data.users = await this.getAllFromStore("users") || {};
            this.data.characters = await this.getAllFromStore("characters") || {};
            this.data.sessions = await this.getAllFromStore("sessions") || {};
        } catch(e) {
            console.error("⚠ [Storage] Falha ao carregar dados locais:", e);
        }
    },

    getAllFromStore(storeName) {
        return new Promise((resolve, reject) => {
            try {
                const tx = this.db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const request = store.getAll();
                
                tx.oncomplete = () => {};
                tx.onerror = (e) => {
                    console.warn(`[Storage] Erro no store ${storeName}:`, e);
                    resolve({});
                };

                request.onsuccess = () => {
                    const results = {};
                    request.result.forEach(item => results[item.id || item.playerId || 'item'] = item);
                    resolve(results);
                };

                request.onerror = (e) => {
                    console.warn(`[Storage] Falha na requisição store ${storeName}:`, e);
                    resolve({});
                };
            } catch (e) {
                console.error(`[Storage] Transação falhou para ${storeName}:`, e);
                resolve({});
            }
        });
    },

    async registerUser(emailOrPhone, userTag) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: emailOrPhone, userTag: userTag })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao registrar Alma.");
            }
            
            return await response.json(); // { playerId, userTag, token }
        } catch(e) {
            console.error("API Auth Error", e);
            throw new Error(e.message === "Failed to fetch" ? "O Servidor Mestre encontra-se offline." : e.message);
        }
    },

    async loginUser(emailOrPhone) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: emailOrPhone })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao autenticar Alma.");
            }

            return await response.json(); // { playerId, userTag, token }
        } catch(e) {
            console.error("API Auth Error", e);
            throw new Error(e.message === "Failed to fetch" ? "O Servidor Mestre encontra-se offline." : e.message);
        }
    },

    getUserData(playerId) {
        return this.data.users[playerId] || null;
    },

    async getCharacter(id) {
        try {
            const response = await fetch(`http://localhost:8080/api/characters/${id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            return this.data.characters[id] || null;
        }
    },

    async fetchPlayerCharacters(playerId) {
        try {
            const response = await fetch(`http://localhost:8080/api/characters/player/${playerId}`);
            if (response.ok) {
                const chars = await response.json();
                chars.forEach(c => this.data.characters[c.id] = c);
                return chars;
            }
        } catch(e) {
            console.error("Erro ao buscar personagens do servidor", e);
        }
        return Object.values(this.data.characters).filter(c => c.playerId === playerId);
    },

    async saveCharacter(playerId, charData) {
        if (charData.playerId && charData.playerId !== playerId) {
            throw new Error("Acesso Negado: Você não é o dono desta ficha.");
        }

        charData.playerId = playerId;
        
        try {
            const response = await fetch('http://localhost:8080/api/characters/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(charData)
            });

            if (!response.ok) throw new Error("Falha ao salvar no Servidor Mestre.");
            
            const savedChar = await response.json();
            this.data.characters[savedChar.id] = savedChar;
            return savedChar.id;
        } catch(e) {

            if (!charData.id) charData.id = `char_${Date.now()}`;
            const tx = this.db.transaction("characters", "readwrite");
            tx.objectStore("characters").put(charData);
            this.data.characters[charData.id] = charData;
            return charData.id;
        }
    },

    async createSession(masterId) {
        const session = {
            masterId,
            players: [masterId],
            logs: []
        };
        try {
            const response = await fetch('http://localhost:8080/api/sessions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
            const saved = await response.json();
            this.data.sessions[saved.id] = saved;
            return saved.id;
        } catch (e) {
            console.error("Erro ao criar sessão remota", e);
            return null;
        }
    },

    async saveSession(id, session) {
        try {
            await fetch('http://localhost:8080/api/sessions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
            this.data.sessions[id] = session;
        } catch (e) {
            console.error("Erro ao salvar sessão remota", e);
        }
    },

    async addLog(id, message, author, type = 'user') {
        const session = this.data.sessions[id];
        if (session) {
            const entry = `[${new Date().toLocaleTimeString()}] ${author}: ${message}`;
            if (!session.logs) session.logs = [];
            session.logs.push(entry);
            await this.saveSession(id, session);
        }
    }
};


