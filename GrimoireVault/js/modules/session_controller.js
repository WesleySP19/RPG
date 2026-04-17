import { Storage } from '../storage.js';
import { UI } from '../ui.js';

/**
 * Handles gaming session logic, controls for GM and Players, and logs.
 */
export const SessionController = {
    async create(app) {
        const sessionKey = await Storage.createSession(app.currentPlayerKey);
        alert(`Sessão Criada: ${sessionKey}`);
        await app.refreshDashboard();
    },

    async join(app) {
        const sessionKey = prompt('Chave da Sessão (Ex: D&D-XXXX):');
        if (sessionKey) {
            const profile = Storage.getActiveProfile(app.currentPlayerKey);
            if (!profile || profile.characters.length === 0) {
                alert('Crie um personagem primeiro!');
                return;
            }
            
            app.pendingSessionKey = sessionKey;
            const characterObjects = await Promise.all(profile.characters.map(id => Storage.getCharacter(id)));
            document.getElementById('modal-inner').innerHTML = UI.renderCharacterSelector(characterObjects.filter(c => c));
            document.getElementById('modal-overlay').style.display = 'flex';
        }
    },

    async enter(key, app) {
        app.currentSessionKey = key;
        await this.refresh(key, app);
        UI.showView('view-session');
    },

    async refresh(key, app) {
        const session = Storage.data.sessions[key];
        if (!session) return;
        const isMaster = session.masterKey === app.currentPlayerKey;
        
        let content = `<div style="display:flex; justify-content:space-between;">
            <h3>Chave: ${key}</h3>
            <span class="badge" style="background:${isMaster ? 'var(--clr-wine)' : 'var(--clr-gold)'}; color:${isMaster ? 'var(--clr-gold)' : 'black'}; padding:2px 8px; font-size:0.6rem;">
                ${isMaster ? 'MESTRE' : 'JOGADOR'}
            </span>
        </div>`;

        if (isMaster) {
            content += UI.renderDMTools();
        } else {
            const charId = session.players[app.currentPlayerKey];
            const char = await Storage.getCharacter(charId);
            if (char) content += UI.renderPlayerSessionControls(char);
        }
        
        content += `<div style="margin-top:1rem; border:1px solid var(--clr-gold); padding:0.5rem; background:rgba(0,0,0,0.05);">
            <p style="font-size:0.6rem; opacity:0.6; margin-bottom:0.5rem;">Presentes na Mesa:</p>`;
        
        for (let pKey in session.players) {
            const charId = session.players[pKey];
            const char = await Storage.getCharacter(charId);
            if (char) content += `<p style="font-size:0.8rem;">• <strong>${char.name}</strong> <small>(${char.class})</small></p>`;
        }
        content += `</div>`;
        
        document.getElementById('session-content').innerHTML = content;
        document.getElementById('diary-logs').innerHTML = UI.renderSessionDiary(session.logs);
    },

    async addNote(app) {
        const input = document.getElementById('diary-input');
        if (input.value.trim() && app.currentSessionKey) {
            const user = Storage.data.users[app.currentPlayerKey];
            await Storage.addLog(app.currentSessionKey, input.value, user.identifier, 'note');
            input.value = '';
            await this.refresh(app.currentSessionKey, app);
        }
    }
};
