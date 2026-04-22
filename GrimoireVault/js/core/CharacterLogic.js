import { GameData } from '../../shared/GameData.js';

export const CharacterLogic = {
    getModifier(score) {
        return Math.floor((score - 10) / 2);
    },

    getProficiencyBonus(level = 1) {
        return Math.floor((level - 1) / 4) + 2;
    },

    calculateLevel(xp) {
        let level = 1;
        for (let i = 0; i < GameData.xpTable.length; i++) {
            if (xp >= GameData.xpTable[i]) level = i + 1;
            else break;
        }
        return level;
    },

    calculateLevelStats(char) {
        const level = this.calculateLevel(char.xp || 0);
        const conScore = char.attributes?.con || 10;
        const hitDie = GameData.classes[char.class]?.hitDie || 10;

        return {
            level: level,
            profBonus: this.getProficiencyBonus(level),
            hpMax: this.calculateBaseHP(conScore, level, hitDie)
        };
    },

    rollAttribute() {
        const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => a - b);
        rolls.shift();
        return rolls.reduce((a, b) => a + b, 0);
    },

    rollAllAttributes() {
        return {
            for: this.rollAttribute(),
            des: this.rollAttribute(),
            con: this.rollAttribute(),
            int: this.rollAttribute(),
            sab: this.rollAttribute(),
            car: this.rollAttribute()
        };
    },

    calculateBaseHP(conScore, level, hitDie) {
        const mod = this.getModifier(conScore);
        return (hitDie + mod) + (level - 1) * (Math.floor(hitDie / 2) + 1 + mod);
    },

    calculateSkill(char, skillName, skillAttr, isProficient = false) {
        const attrScore = char.attributes?.[skillAttr] || 10;
        const mod = this.getModifier(attrScore);
        const prof = isProficient ? this.getProficiencyBonus(char.level || 1) : 0;
        return mod + prof;
    },

    calculatePassivePerception(char, isProficient = false) {
        const mod = this.getModifier(char.attributes?.sab || 10);
        const prof = isProficient ? this.getProficiencyBonus(char.level || 1) : 0;
        return 10 + mod + prof;
    },

    generateBackstory(char) {
        const classThemes = {
            'Barbaro': 'buscou nas terras selvagens a força bruta necessária para sobreviver.',
            'Mago': 'dedicou anos de estudo em torres isoladas para dominar a trama da magia.',
            'Ladino': 'sobreviveu aos becos mais perigosos usando sua astúcia e mãos leves.',
            'Guerreiro': 'serviu em exércitos ou arenas, forjando seu destino através do aço.',
            'Paladino': 'jurou proteger os fracos e seguir um código sagrado inquebrável.'
        };

        const raceThemes = {
            'Humano': 'Como humano, sua ambição o levou a ultrapassar os limites de sua própria mortalidade.',
            'Elfo': 'Sua herança élfica lhe conferiu uma paciência secular e uma conexão profunda com o arcano.',
            'Anão': 'Forjado na rocha e na tradição, carrega o peso de seus ancestrais em cada golpe.',
            'Tiefling': 'Marcado por sua linhagem, aprendeu a confiar apenas em si mesmo em um mundo de preconceitos.'
        };

        const text = `${raceThemes[char.race] || 'Nascido em terras distantes,'} ${classThemes[char.class] || 'seguiu um caminho de aventura.'} Atualmente, como um ${char.class} de nível ${char.level}, busca não apenas tesouros, mas o verdadeiro significado de seu juramento.`;
        
        return text;
    },

    calculateTotalWeight(inventory = []) {
        return inventory.reduce((sum, item) => sum + (item.weight || 0) * (item.quantity || 1), 0);
    },

    calculateAC(char) {
        const dexMod = this.getModifier(char.attributes?.des || 10);
        let baseAC = 10 + dexMod;

        const armor = char.inventory?.find(i => i.type === 'light' || i.type === 'medium' || i.type === 'heavy');
        const shield = char.inventory?.find(i => i.type === 'shield');

        if (armor) {
            if (armor.type === 'light') baseAC = armor.ac + dexMod;
            if (armor.type === 'medium') baseAC = armor.ac + Math.min(dexMod, 2);
            if (armor.type === 'heavy') baseAC = armor.ac;
        }

        if (shield) baseAC += shield.ac;
        
        return baseAC;
    }
};

