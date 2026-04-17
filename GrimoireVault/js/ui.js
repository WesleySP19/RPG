/**
 * UI Controller
 * Orchestrating Views, Modals, and global interactions.
 */
import { Dashboard } from './components/Dashboard.js';
import { CharacterSheet } from './components/CharacterSheet.js';
import { Codice } from './components/Codice.js';
import { SRDViewer } from './components/SRDViewer.js';

export const UI = {
    showView(viewId) {
        document.querySelectorAll('.view-container').forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
        });
        const target = document.getElementById(viewId);
        if (target) {
            target.classList.add('active');
            target.style.display = 'block';
        }
    },

    openModal(content) {
        const overlay = document.getElementById('modal-overlay');
        const inner = document.getElementById('modal-inner');
        inner.innerHTML = content;
        overlay.style.display = 'flex';
    },

    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    },

    renderDashboard(profile, sessions) {
        const view = document.getElementById('view-dashboard');
        view.innerHTML = Dashboard.render(profile, sessions);
    },

    renderCharacterList(chars) {
        const list = document.getElementById('character-list');
        if (list) list.innerHTML = Dashboard.renderCharList(chars);
    },

    renderSessionList(sessions) {
        const list = document.getElementById('active-sessions');
        if (list) list.innerHTML = Dashboard.renderSessionList(sessions);
    },

    renderSheet(char) {
        const content = document.getElementById('sheet-content');
        content.innerHTML = CharacterSheet.render(char);
    },

    renderCodice(mode) {
        const content = document.getElementById('codice-content');
        content.innerHTML = Codice.render(mode);
    },

    renderSRD(data, category) {
        this.openModal(SRDViewer.render(data, category));
    },

    renderSessionDiary(logs = []) {
        const diary = document.getElementById('diary-logs');
        if (!diary) return;
        diary.innerHTML = logs.slice().reverse().map(l => `
            <div class="log-entry" style="margin-bottom:12px; border-left:2px solid var(--clr-gold); padding-left:10px; animation: fadeInBlur 0.3s ease-out;">
                <div style="font-size:8px; opacity:0.6; text-transform:uppercase;">${l.author}</div>
                <div style="font-size:11px; line-height:1.4;">${l.message}</div>
            </div>
        `).join('');
    }
};
