import { UI } from '../ui.js';

/**
 * Handles SRD compendium loading, searching, and filtering.
 */
export const SRDBrowser = {
    srdData: null,
    currentFilter: 'all',
    currentLevel: 'all',

    async show(app) {
        if (!this.srdData) {
            const r = await fetch('./rules_srd.json');
            this.srdData = await r.json();
        }
        this.update();
        document.getElementById('modal-overlay').style.display = 'flex';
    },

    update() {
        const query = document.getElementById('srd-search')?.value || '';
        document.getElementById('modal-inner').innerHTML = UI.renderSRD(this.srdData, query, this.currentFilter, this.currentLevel);
    },

    setFilter(filter) {
        this.currentFilter = filter;
        this.update();
    },

    setLevel(level) {
        this.currentLevel = level;
        this.update();
    }
};
