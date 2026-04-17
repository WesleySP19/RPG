/**
 * GameData Module
 * Definitions for D&D 5e Classes, Skills, and Attributes.
 */
export const GameData = {
    classes: {
        'Barbaro': { hitDie: 12, saves: ['for', 'con'], primary: ['for'] },
        'Bardo': { hitDie: 8, saves: ['des', 'car'], primary: ['car'] },
        'Clerigo': { hitDie: 8, saves: ['sab', 'car'], primary: ['sab'] },
        'Druida': { hitDie: 8, saves: ['int', 'sab'], primary: ['sab'] },
        'Guerreiro': { hitDie: 10, saves: ['for', 'con'], primary: ['for', 'des'] },
        'Monge': { hitDie: 8, saves: ['for', 'des'], primary: ['des', 'sab'] },
        'Paladino': { hitDie: 10, saves: ['sab', 'car'], primary: ['for', 'car'] },
        'Guardiao': { hitDie: 10, saves: ['for', 'des'], primary: ['des', 'sab'] },
        'Ladino': { hitDie: 8, saves: ['des', 'int'], primary: ['des'] },
        'Feiticeiro': { hitDie: 6, saves: ['con', 'car'], primary: ['car'] },
        'Bruxo': { hitDie: 8, saves: ['sab', 'car'], primary: ['car'] },
        'Mago': { hitDie: 6, saves: ['int', 'sab'], primary: ['int'] }
    },

    skills: [
        { name: 'Acrobacia', attr: 'des' },
        { name: 'Arcanismo', attr: 'int' },
        { name: 'Atletismo', attr: 'for' },
        { name: 'Atuacao', attr: 'car' },
        { name: 'Blefar', attr: 'car' },
        { name: 'Furtividade', attr: 'des' },
        { name: 'Historia', attr: 'int' },
        { name: 'Intimidacao', attr: 'car' },
        { name: 'Intuicao', attr: 'sab' },
        { name: 'Investigacao', attr: 'int' },
        { name: 'Lidar com Animais', attr: 'sab' },
        { name: 'Medicina', attr: 'sab' },
        { name: 'Natureza', attr: 'int' },
        { name: 'Percepcao', attr: 'sab' },
        { name: 'Persuasao', attr: 'car' },
        { name: 'Prestidigitacao', attr: 'des' },
        { name: 'Religiao', attr: 'int' },
        { name: 'Sobrevivencia', attr: 'sab' }
    ],

    alignments: [
        'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
        'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
        'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
    ]
};
