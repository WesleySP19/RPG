/**
 * RulesEngine.js (v2.0) - Worker Proxy
 * Interacts with RulesWorker.js to keep the UI thread free.
 */

export class RulesEngineProxy {
    constructor() {
        this.worker = new Worker('./js/workers/RulesWorker.js', { type: 'module' });
        this.pendingRequests = new Map();
        
        this.worker.onmessage = (event) => {
            const { requestId, result, error } = event.data;
            if (this.pendingRequests.has(requestId)) {
                const { resolve, reject } = this.pendingRequests.get(requestId);
                if (error) reject(error);
                else resolve(result);
                this.pendingRequests.delete(requestId);
            }
        };
    }

    async getModifier(score) {
        return this._send('calculateModifier', { score });
    }

    async rollCheck(modifier = 0) {
        return this._send('rollCheck', { modifier });
    }

    async deriveStats(attributes) {
        return this._send('deriveStats', attributes);
    }

    _send(action, data) {
        const requestId = crypto.randomUUID();
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, { resolve, reject });
            this.worker.postMessage({ action, data, requestId });
        });
    }
}

export const RulesEngine = new RulesEngineProxy();
