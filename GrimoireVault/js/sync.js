import { State } from './state.js';
import { Storage } from './storage.js';

/**
 * Grimoire Sync Engine
 * Handles multi-tab synchronization via BroadcastChannel.
 */
class GrimoireSync {
    constructor() {
        this.channel = new BroadcastChannel('grimoire_vault_sync');
        this.setupListeners();
    }

    setupListeners() {
        // Listen for changes from other tabs
        this.channel.onmessage = async (event) => {
            const { type, payload } = event.data;
            console.log(`Sync received: ${type}`, payload);

            if (type === 'STATE_UPDATE') {
                const { path, value } = payload;
                // Update local state without re-triggering broadcast (ideally)
                // We use a flag or simple check to avoid loops
                this._applyRemoteUpdate(path, value);
            }
        };

        // Broadcast local state changes
        State.subscribe((path, value) => {
            // Only broadcast data that should be shared (users, sessions, tavern)
            if (path.startsWith('users') || path.startsWith('sessions') || path.startsWith('tavernBoard')) {
                this.broadcast('STATE_UPDATE', { path, value });
            }
        });
    }

    broadcast(type, payload) {
        this.channel.postMessage({ type, payload, timestamp: Date.now() });
    }

    _applyRemoteUpdate(path, value) {
        // Navigate the State object to apply the value
        const parts = path.split('.');
        let target = State.data;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
        }
        
        // Update without causing infinite loops
        // Our Proxy is smart enough to check if value is the same,
        // but let's be explicit if needed.
        const lastPart = parts[parts.length - 1];
        if (JSON.stringify(target[lastPart]) !== JSON.stringify(value)) {
            target[lastPart] = value;
        }
    }
}

export const Sync = new GrimoireSync();
