import { Storage } from '../storage.js';
import { UI } from '../ui.js';

/**
 * Handles all character sheet specific logic, validations, and rendering updates.
 */
export const SheetManager = {
    async open(id, app) {
        const char = await Storage.getCharacter(id);
        if (char) {
            app.editingCharId = id;
            document.getElementById('sheet-content').innerHTML = UI.renderReadOnlySheet(char);
            UI.showView('view-sheet');
        }
    },

    async edit(id, app) {
        const char = await Storage.getCharacter(id);
        app.editingCharId = id;
        document.getElementById('sheet-content').innerHTML = UI.renderCharacterForm(char);
        UI.showView('view-sheet');
    },

    async save(app) {
        const charData = {
            id: app.editingCharId,
            name: document.getElementById('char-name').value,
            race: document.getElementById('char-race').value,
            class: document.getElementById('char-class').value,
            hp: parseInt(document.getElementById('char-hp').value) || 10,
            ac: parseInt(document.getElementById('char-ac').value) || 10,
            attributes: {
                for: parseInt(document.getElementById('attr-for').value),
                des: parseInt(document.getElementById('attr-des').value),
                con: parseInt(document.getElementById('attr-con').value),
                int: parseInt(document.getElementById('attr-int').value),
                sab: parseInt(document.getElementById('attr-sab').value),
                car: parseInt(document.getElementById('attr-car').value),
            },
            bio: document.getElementById('char-bio').value
        };

        // Regra T2.5: Validador 5e
        for (let a in charData.attributes) {
            if (charData.attributes[a] > 20) {
                alert(`O atributo ${a.toUpperCase()} não pode exceder 20 em níveis iniciais!`);
                return false;
            }
        }

        await Storage.saveCharacter(app.currentPlayerKey, charData);
        alert('Ficha selada!');
        app.refreshDashboard();
        UI.showView('view-dashboard');
        return true;
    },

    handleAttributeChange(input) {
        const score = parseInt(input.value) || 0;
        const attr = input.id.split('-')[1];
        const mod = Math.floor((score - 10) / 2);
        const modDisplay = document.getElementById(`mod-${attr}`);
        if (modDisplay) {
            modDisplay.textContent = (mod >= 0 ? '+' : '') + mod;
            modDisplay.style.color = score > 20 ? 'red' : 'var(--clr-wine)';
        }
    }
};
