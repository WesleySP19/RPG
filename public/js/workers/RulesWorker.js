/**
 * RulesWorker.js - Background Rule Processing
 * Handles heavy math and rule derivations without blocking the UI.
 */

// We can't easily import ESM in workers without type: 'module', 
// so we'll implement the logic here or use importScripts if not using ESM.
// Since we want Production vanilla, we use ESM workers.

self.onmessage = (event) => {
    const { action, data } = event.data;

    switch (action) {
        case 'calculateModifier':
            const mod = Math.floor((data.score - 10) / 2);
            self.postMessage({ action, result: mod, requestId: event.data.requestId });
            break;

        case 'rollCheck':
            const roll = Math.floor(Math.random() * 20) + 1;
            self.postMessage({ 
                action, 
                result: {
                    roll,
                    total: roll + (data.modifier || 0),
                    isCritical: roll === 20,
                    isFumble: roll === 1
                },
                requestId: event.data.requestId 
            });
            break;

        case 'deriveStats':
            const derived = {
                hpMax: 10 + Math.floor((data.con - 10) / 2),
                initiative: Math.floor((data.dex - 10) / 2),
                perception: 10 + Math.floor((data.wis - 10) / 2)
            };
            self.postMessage({ action, result: derived, requestId: event.data.requestId });
            break;

        default:
            self.postMessage({ error: 'Unknown action' });
    }
};
