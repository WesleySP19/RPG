/**
 * Store.js - High-Performance Reactive Store
 * Uses Proxy API with Proxy Caching and Event Batching.
 */

export class Store {
    constructor(initialState = {}, storeName = null) {
        this.listeners = [];
        this.storeName = storeName;
        this.initialState = initialState;
        this.proxyCache = new WeakMap();
        this.isBatching = false;
        this.pendingUpdates = new Set();
        this.state = this._createProxy(this.initialState);
    }

    _createProxy(data) {
        if (typeof data !== 'object' || data === null) return data;
        if (this.proxyCache.has(data)) return this.proxyCache.get(data);

        const self = this;
        const proxy = new Proxy(data, {
            set(target, property, value, receiver) {
                const oldValue = Reflect.get(target, property, receiver);
                if (oldValue === value) return true; // No change

                const result = Reflect.set(target, property, value, receiver);
                self._notify(property, value);
                return result;
            },
            get(target, property, receiver) {
                const value = Reflect.get(target, property, receiver);
                if (typeof value === 'object' && value !== null) {
                    return self._createProxy(value);
                }
                return value;
            }
        });

        this.proxyCache.set(data, proxy);
        return proxy;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    _notify(prop, val) {
        if (this.isBatching) {
            this.pendingUpdates.add(prop);
            return;
        }
        this._dispatchToListeners();
    }

    _dispatchToListeners() {
        this.listeners.forEach(callback => callback(this.state));
    }

    /**
     * Batch multiple updates into a single re-render.
     */
    batch(fn) {
        this.isBatching = true;
        this.pendingUpdates.clear();
        try {
            fn(this.state);
        } finally {
            this.isBatching = false;
            if (this.pendingUpdates.size > 0) {
                this._dispatchToListeners();
                this.pendingUpdates.clear();
            }
        }
    }

    /**
     * Bulk update utility.
     */
    update(patch) {
        this.batch((state) => {
            for (const key in patch) {
                if (Object.hasOwn(patch, key)) {
                    state[key] = patch[key];
                }
            }
        });
    }
}

// Global Stores
export const playerStore = new Store({
    name: 'Aventureiro',
    race: 'Humano',
    class: 'Guerreiro',
    level: 1,
    hp: 10,
    hpMax: 10,
    baseAttrs: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
    },
    skills: [],
    inventory: []
}, 'rpg_forge_player');

export const gmStore = new Store({
    encounter: [],
    initiative: [],
    activeMesa: 'DEFAULT',
    playersOnline: []
}, 'rpg_forge_gm');
