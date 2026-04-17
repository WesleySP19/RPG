import { Storage } from './storage.js';

/**
 * Grimoire State Management (Observable Proxy Pattern)
 * Decouples Storage from UI and provides reactive updates.
 */
class GrimoireState {
    constructor() {
        this.listeners = new Set();
        this.data = this._createReactiveProxy({
            users: {},
            sessions: {},
            tavernBoard: [],
            currentUser: null,
            activeSession: null,
            ui: {
                currentView: 'view-login',
                loading: false
            }
        });
    }

    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Notify all listeners of a state change
     */
    _notify(path, value) {
        this.listeners.forEach(callback => callback(path, value, this.data));
    }

    /**
     * Create a recursive proxy to detect nested changes
     */
    _createReactiveProxy(obj, path = []) {
        const self = this;
        return new Proxy(obj, {
            get(target, prop) {
                const value = target[prop];
                if (value && typeof value === 'object') {
                    return self._createReactiveProxy(value, [...path, prop]);
                }
                return value;
            },
            set(target, prop, value) {
                const oldVal = target[prop];
                if (oldVal === value) return true;

                target[prop] = value;
                const fullPath = [...path, prop];
                
                // Auto-save logic for specific branches
                self._handleAutoSave(fullPath, value);
                
                // Notify UI
                self._notify(fullPath.join('.'), value);
                return true;
            }
        });
    }

    async _handleAutoSave(path, value) {
        if (!Storage.db) return;

        const branch = path[0];
        const key = path[1];

        if (branch === 'users' && key) {
            await Storage.save('users', key, this.data.users[key]);
        } else if (branch === 'sessions' && key) {
            await Storage.save('sessions', key, this.data.sessions[key]);
        } else if (branch === 'tavernBoard') {
            await Storage.save('tavern', 'main_board', this.data.tavernBoard);
        }
    }

    /**
     * Sync in-memory state with Storage
     */
    async syncFromStorage() {
        this.data.ui.loading = true;
        this.data.users = Storage.data.users;
        this.data.sessions = Storage.data.sessions;
        this.data.tavernBoard = Storage.data.tavernBoard;
        this.data.ui.loading = false;
    }
}

export const State = new GrimoireState();
