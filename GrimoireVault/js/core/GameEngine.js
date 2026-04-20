import { CharacterLogic } from './CharacterLogic.js';
import { GameData } from '../../shared/GameData.js';
import { Storage } from '../services/Storage.js';


export const GameEngine = {
    session: {
        id: 'SESS-001-ALPHA',
        state: 'EXPLORACAO',
        players: [],
        log: [],
        timestamp: new Date().toISOString()
    },

    async init(playerCharacter) {
        this.session.players = [playerCharacter];
        console.log("Game Engine Initialized for Session:", this.session.id);

        await this.postDMResponse({
            narrativa: "As portas do Dragão Partido se abrem... O Mestre observa seus primeiros passos no Grimoire Vault.",
            mecanica: "Ambiente: Taverna. Dificuldade Passiva: 12.",
            consequencia: "Aventura Iniciada.",
            atualizacao: { hp: playerCharacter.hpCurrent, xp: playerCharacter.xp }
        });
    },

    async processAction(actionText) {
        const player = this.session.players[0]; // Simulation: 1 player for now

        this.addLog('player', actionText);

        return new Promise(resolve => {
            setTimeout(async () => {
                const response = await this.generateIAResponse(player, actionText);
                await this.postDMResponse(response);
                resolve(response);
            }, 800);
        });
    },

    
    async generateIAResponse(player, action) {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const mod = CharacterLogic.getModifier(player.attributes?.sab || 10);
        const roll = d20 + mod;

        if (action.toLowerCase().includes('observo') || action.toLowerCase().includes('olho')) {
            if (roll >= 12) {
                return {
                    narrativa: `Você estreita os olhos. Por trás de Bruenor, você percebe que os dois encapuzados escondem adagas curtas sob suas vestes. Eles parecem tensos, esperando alguém.`,
                    mecanica: `Percepção: ${d20} + ${mod} = ${roll} (Sucesso)`,
                    consequencia: `Você agora sabe que eles estão armados.`,
                    atualizacao: { xp: player.xp + 25 }
                };
            } else {
                return {
                    narrativa: `A fumaça da taverna turva sua visão. Você vê apenas dois viajantes comuns aproveitando o calor do fogo.`,
                    mecanica: `Percepção: ${d20} + ${mod} = ${roll} (Falha)`,
                    consequencia: `Nenhum detalhe adicional percebido.`,
                    atualizacao: {}
                };
            }
        }

        return {
            narrativa: `A sua ação de "${action}" ecoa na taverna. Bruenor limpa o balcão e diz: "Seja rápido herói, o tempo é ouro e a cerveja está esquentando."`,
            mecanica: `Interação Social Neutra.`,
            consequencia: `O mundo reage à sua presença.`,
            atualizacao: {}
        };
    },

    async postDMResponse(packet) {
        this.addLog('dm', packet);

        window.dispatchEvent(new CustomEvent('engine-response', { detail: packet }));
    },

    addLog(type, content) {
        const entry = {
            id: Date.now(),
            type,
            content,
            timestamp: new Date().toISOString()
        };
        this.session.log.push(entry);
        console.log(`[EVENT_LOG] ${type.toUpperCase()}:`, content);
    }
};

