/**
 * CharacterLogic Module
 * Automation for modifiers, skills, and combat stats.
 */
export const CharacterLogic = {
    getModifier(score) {
        return Math.floor((score - 10) / 2);
    },

    getProficiencyBonus(level = 1) {
        return Math.ceil(level / 4) + 1;
    },

    calculateSkill(char, skillName, skillAttr, isProficient = false) {
        const attrScore = char.attributes?.[skillAttr] || 10;
        const mod = this.getModifier(attrScore);
        const prof = isProficient ? this.getProficiencyBonus(char.level) : 0;
        return mod + prof;
    },

    calculatePassivePerception(char, isProficient = false) {
        const mod = this.getModifier(char.attributes?.sab || 10);
        const prof = isProficient ? this.getProficiencyBonus(char.level) : 0;
        return 10 + mod + prof;
    }
};
