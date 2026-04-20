
export const GameData = {
    xpTable: [
        0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
        85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
    ],

    classes: {
        'Barbaro': { hitDie: 12, saves: ['for', 'con'], primary: ['for'], desc: 'Um lutador feroz que pode entrar em uma fúria de batalha.' },
        'Bardo': { hitDie: 8, saves: ['des', 'car'], primary: ['car'], desc: 'Um mestre da música e da magia que inspira aliados.' },
        'Clerigo': { hitDie: 8, saves: ['sab', 'car'], primary: ['sab'], desc: 'Um guerreiro divino que canaliza o poder dos deuses.' },
        'Druida': { hitDie: 8, saves: ['int', 'sab'], primary: ['sab'], desc: 'Um guardião da natureza que pode assumir formas animais.' },
        'Guerreiro': { hitDie: 10, saves: ['for', 'con'], primary: ['for', 'des'], desc: 'Um mestre do combate armado e das táticas.' },
        'Monge': { hitDie: 8, saves: ['for', 'des'], primary: ['des', 'sab'], desc: 'Um artista marcial que utiliza a energia Ki.' },
        'Paladino': { hitDie: 10, saves: ['sab', 'car'], primary: ['for', 'car'], desc: 'Um herói sagrado ligado por um juramento divino.' },
        'Guardiao': { hitDie: 10, saves: ['for', 'des'], primary: ['des', 'sab'], desc: 'Um rastreador habilidoso e mestre da sobrevivência.' },
        'Ladino': { hitDie: 8, saves: ['des', 'int'], primary: ['des'], desc: 'Um especialista em furtividade, perícias e precisão.' },
        'Feiticeiro': { hitDie: 6, saves: ['con', 'car'], primary: ['car'], desc: 'Um conjurador nato com magia correndo em suas veias.' },
        'Bruxo': { hitDie: 8, saves: ['sab', 'car'], primary: ['car'], desc: 'Um conjurador que fez um pacto com um ser poderoso.' },
        'Mago': { hitDie: 6, saves: ['int', 'sab'], primary: ['int'], desc: 'Um estudioso da magia que manipula a realidade.' }
    },

    races: {
        'Humano': { bonuses: { for: 1, des: 1, con: 1, int: 1, sab: 1, car: 1 }, speed: '9m', languages: ['Comum', 'Língua Extra'], desc: 'Versáteis e ambiciosos, adaptam-se a qualquer situação.' },
        'Elfo': { bonuses: { des: 2 }, speed: '9m', languages: ['Comum', 'Élfico'], desc: 'Seres graciosos com sentidos aguçados e vida longa.' },
        'Anão': { bonuses: { con: 2 }, speed: '7.5m', languages: ['Comum', 'Anão'], desc: 'Resistentes e habilidosos, mestres da pedra e do metal.' },
        'Draconato': { bonuses: { for: 2, car: 1 }, speed: '9m', languages: ['Comum', 'Dracônico'], desc: 'Descendentes de dragões com sopros elementares.' },
        'Tiefling': { bonuses: { car: 2, int: 1 }, speed: '9m', languages: ['Comum', 'Infernal'], desc: 'Herdeiros de linhagens infernais com habilidades sombrias.' },
        'Halfling': { bonuses: { des: 2 }, speed: '7.5m', languages: ['Comum', 'Gigante'], desc: 'Pequenos, ágeis e conhecidos por sua sorte incomum.' }
    },

    skills: [
        { name: 'Acrobacia', attr: 'des', desc: 'Manter-se equilibrado ou fazer acrobacias.' },
        { name: 'Arcanismo', attr: 'int', desc: 'Conhecimento sobre magia e planos.' },
        { name: 'Atletismo', attr: 'for', desc: 'Escalar, saltar ou nadar.' },
        { name: 'Atuacao', attr: 'car', desc: 'Entreter o público com música ou drama.' },
        { name: 'Enganacao', attr: 'car', desc: 'Esconder a verdade ou mentir.' },
        { name: 'Furtividade', attr: 'des', desc: 'Mover-se sem ser visto ou ouvido.' },
        { name: 'Historia', attr: 'int', desc: 'Lembrar de eventos históricos e reinos.' },
        { name: 'Intimidacao', attr: 'car', desc: 'Usar medo para obter informações.' },
        { name: 'Intuicao', attr: 'sab', desc: 'Perceber se alguém está mentindo.' },
        { name: 'Investigacao', attr: 'int', desc: 'Encontrar pistas ou deduzir fatos.' },
        { name: 'Lidar com Animais', attr: 'sab', desc: 'Acalmar feras ou montar criaturas.' },
        { name: 'Medicina', attr: 'sab', desc: 'Estabilizar feridos ou diagnosticar doenças.' },
        { name: 'Natureza', attr: 'int', desc: 'Conhecimento sobre plantas e clima.' },
        { name: 'Percepcao', attr: 'sab', desc: 'Notar perigos ou detalhes escondidos.' },
        { name: 'Persuasao', attr: 'car', desc: 'Convencer alguém com bons argumentos.' },
        { name: 'Prestidigitacao', attr: 'des', desc: 'Trapaças, furtar bolsos ou esconder objetos.' },
        { name: 'Religiao', attr: 'int', desc: 'Conhecimento sobre deuses e ritos.' },
        { name: 'Sobrevivencia', attr: 'sab', desc: 'Rastrear, caçar e encontrar abrigo.' }
    ],

    items: {
        weapons: [
            { id: 'longsword', name: 'Espada Longa', damage: '1d8', weight: 3, type: 'martial' },
            { id: 'shortbow', name: 'Arco Curto', damage: '1d6', weight: 2, type: 'simple' },
            { id: 'dagger', name: 'Adaga', damage: '1d4', weight: 1, type: 'simple' }
        ],
        armor: [
            { id: 'leather', name: 'Couro', ac: 11, weight: 10, type: 'light' },
            { id: 'chainmail', name: 'Cota de Malha', ac: 16, weight: 55, type: 'heavy' },
            { id: 'shield', name: 'Escudo', ac: 2, weight: 6, type: 'shield' }
        ],
        gear: [
            { id: 'potion_heal', name: 'Poção de Cura', weight: 0.5 },
            { id: 'backpack', name: 'Mochila', weight: 5 }
        ]
    }
};

