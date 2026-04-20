
import { Dashboard } from './Dashboard.js';
import { CharacterSheet } from './CharacterSheet.js';
import { Codice } from './Codice.js';
import { SRDViewer } from './SRDViewer.js';

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
        const view = document.getElementById('view-sheet');
        if (!view) return;

        if (!document.getElementById('builder-sidebar')) {
            view.innerHTML = CharacterSheet.render(char);
        }

        const sidebar = document.getElementById('builder-sidebar');
        const card = document.getElementById('hero-card-preview');
        const sheet = document.getElementById('hero-sheet-preview');

        if (sidebar) sidebar.innerHTML = CharacterSheet.renderCreator(char);
        if (card) card.innerHTML = CharacterSheet.renderCard(char);
        if (sheet) sheet.innerHTML = CharacterSheet.renderSheet(char);
    },

    renderCodice(mode) {
        const content = document.getElementById('codice-content');
        if (content) {
            content.innerHTML = Codice.render(mode);
        } else {
            console.warn("⚠ [UI] Elemento 'codice-content' não encontrado.");
        }
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

