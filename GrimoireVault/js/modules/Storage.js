/**
 * Grimoire Storage Module
 * Persistent IndexedDB Engine for scalable RPG data.
 */
export const Storage = {
    db: null,
    data: {
        profiles: {},
        characters: {},
        sessions: {}
    },

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("GrimoireVaultDB", 5);

            request.onerror = () => reject("Erro ao abrir Grimório");
            
            request.onsuccess = (e) => {
                this.db = e.target.result;
                this.loadAll().then(resolve);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("profiles")) db.createObjectStore("profiles", { keyPath: "key" });
                if (!db.objectStoreNames.contains("characters")) db.createObjectStore("characters", { keyPath: "id" });
                if (!db.objectStoreNames.contains("sessions")) db.createObjectStore("sessions", { keyPath: "id" });
            };
        });
    },

    async loadAll() {
        this.data.profiles = await this.getAllFromStore("profiles");
        this.data.characters = await this.getAllFromStore("characters");
        this.data.sessions = await this.getAllFromStore("sessions");
    },

    getAllFromStore(storeName) {
        return new Promise(resolve => {
            const tx = this.db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                const results = {};
                request.result.forEach(item => results[item.key || item.id] = item);
                resolve(results);
            };
        });
    },

    // --- Profile Operations ---
    getActiveProfile(key) {
        if (!this.data.profiles[key]) {
            this.data.profiles[key] = { key, characters: [], sessions: [] };
            this.saveProfile(key);
        }
        return this.data.profiles[key];
    },

    async saveProfile(key) {
        const tx = this.db.transaction("profiles", "readwrite");
        tx.objectStore("profiles").put(this.data.profiles[key]);
    },

    // --- Character Operations ---
    async getCharacter(id) {
        return this.data.characters[id];
    },

    async saveCharacter(profileKey, charData) {
        if (!charData.id) charData.id = `char_${Date.now()}`;
        
        const tx = this.db.transaction(["characters", "profiles"], "readwrite");
        tx.objectStore("characters").put(charData);
        this.data.characters[charData.id] = charData;

        const profile = this.data.profiles[profileKey];
        if (!profile.characters.includes(charData.id)) {
            profile.characters.push(charData.id);
            tx.objectStore("profiles").put(profile);
        }
        return charData.id;
    },

    // --- Session Operations ---
    async createSession(masterKey) {
        const id = 'MESA-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        const session = {
            id,
            masterKey,
            logs: [],
            initiative: [],
            mapTokens: []
        };
        const tx = this.db.transaction("sessions", "readwrite");
        tx.objectStore("sessions").put(session);
        this.data.sessions[id] = session;
        return id;
    },

    async saveSession(id, session) {
        const tx = this.db.transaction("sessions", "readwrite");
        tx.objectStore("sessions").put(session);
        this.data.sessions[id] = session;
    },

    async addLog(id, message, author, type = 'user') {
        const session = this.data.sessions[id];
        if (session) {
            session.logs.push({ message, author, type, time: Date.now() });
            await this.saveSession(id, session);
        }
    }
};
