/**
 * Compendium.js - Database of items, spells, and monsters.
 * In a real app, this would fetch from a database or JSON file.
 * Here we provide a mock structure.
 */

export const Compendium = {
    items: [
        { id: 'longsword', name: 'Espada Longa', type: 'weapon', damage: '1d8', weight: 3 },
        { id: 'shield', name: 'Escudo', type: 'armor', ac: 2, weight: 6 },
        { id: 'potion_heal', name: 'Poção de Cura', type: 'consumable', effect: '2d4+2' }
    ],
    spells: [
        { id: 'fireball', name: 'Bola de Fogo', level: 3, school: 'Evocation' },
        { id: 'cure_wounds', name: 'Curar Ferimentos', level: 1, school: 'Abjuration' }
    ],
    monsters: [
        { id: 'goblin', name: 'Goblin', hp: 7, ac: 15, cr: '1/4' },
        { id: 'orc', name: 'Orc', hp: 15, ac: 13, cr: '1/2' }
    ],

    getItem(id) {
        return this.items.find(i => i.id === id);
    },

    getSpell(id) {
        return this.spells.find(s => s.id === id);
    }
};
