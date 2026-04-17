import { GameData } from '../modules/GameData.js';
import { CharacterLogic } from '../modules/CharacterLogic.js';

export const CharacterSheet = {
    render(char = {}) {
        const stats = ['for', 'des', 'con', 'int', 'sab', 'car'];
        const profBonus = CharacterLogic.getProficiencyBonus(char.level || 1);
        
        return `
            <div class="sheet-pro">
                <!-- CABEÇALHO -->
                <div class="sheet-header">
                    <div class="box">
                        <label>Nome do Personagem</label>
                        <input type="text" id="char-name" value="${char.name || ''}" style="font-size: 1.2rem; font-weight: bold;">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                        <div><label>Classe e Nível</label><input type="text" id="char-class" value="${char.class||''}"></div>
                        <div><label>Antecedente</label><input type="text" id="char-bg" value="${char.background||''}"></div>
                        <div><label>Raça</label><input type="text" id="char-race" value="${char.race||''}"></div>
                        <div><label>Alinhamento</label><input type="text" id="char-align" value="${char.alignment||''}"></div>
                    </div>
                </div>

                <!-- COLUNA 1: ATRIBUTOS E PERÍCIAS -->
                <div class="column">
                    <div style="display:flex; gap:10px;">
                        <div class="stats-col" style="width: 80px;">
                            ${stats.map(s => {
                                const score = char.attributes?.[s] || 10;
                                const mod = CharacterLogic.getModifier(score);
                                return `
                                    <div class="attr-box-pro">
                                        <small style="font-size:8px;">${s.toUpperCase()}</small>
                                        <span class="attr-mod">${mod >= 0 ? '+' : ''}${mod}</span>
                                        <input type="number" class="attr-score attr-field" data-attr="${s}" value="${score}">
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="skills-col" style="flex:1;">
                            <div class="panel" style="border:1px solid #000; padding:5px; margin-bottom:10px;">
                                <label style="font-size:9px;">Bônus Proficiência: +${profBonus}</label>
                            </div>
                            <div class="skill-list-pro">
                                <h4 style="font-size:10px; margin-bottom:5px;">PERÍCIAS</h4>
                                ${GameData.skills.map(skill => {
                                    const bonus = CharacterLogic.calculateSkill(char, skill.name, skill.attr, char.proficiencies?.includes(skill.name));
                                    return `
                                        <div class="skill-item-pro">
                                            <input type="checkbox" ${char.proficiencies?.includes(skill.name) ? 'checked' : ''} disabled>
                                            <span style="font-weight:bold;">${bonus >= 0 ? '+' : ''}${bonus}</span>
                                            <span>${skill.name} <small style="opacity:0.5; font-size:7px;">(${skill.attr.toUpperCase()})</small></span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- COLUNA 2: COMBATE E VITALIDADE -->
                <div class="column">
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div class="combat-box-pro">
                            <label style="font-size:8px;">CLASSE ARMADURA</label>
                            <input type="number" id="char-ac" value="${char.ac || 10}" style="font-size:1.5rem; text-align:center;">
                        </div>
                        <div class="combat-box-pro">
                            <label style="font-size:8px;">INICIATIVA</label>
                            <div style="font-size:1.5rem;">${CharacterLogic.getModifier(char.attributes?.des || 10)}</div>
                        </div>
                        <div class="combat-box-pro">
                            <label style="font-size:8px;">DESLOCAMENTO</label>
                            <input type="text" id="char-speed" value="${char.speed || '9m'}" style="font-size:1.2rem; text-align:center;">
                        </div>
                    </div>
                    
                    <div class="hp-box-pro">
                        <label style="font-size:8px;">PONTOS DE VIDA ATUAIS</label>
                        <input type="number" id="char-hp-current" value="${char.hpCurrent || 10}" style="width:100%; font-size:1.5rem; text-align:center;">
                        <hr style="border:0; border-bottom:1px solid #000;">
                        <label style="font-size:8px;">MÁXIMO DE PV: <input type="number" id="char-hp-max" value="${char.hpMax || 10}" style="width:40px;"></label>
                    </div>

                    <div style="margin-top:20px; border:1px solid #000; padding:10px;">
                        <h4 style="font-size:10px;">ATAQUES E MAGIAS</h4>
                        <textarea id="char-attacks" class="grimoire-input" style="width:100%; height:150px; font-size:10px; color:#000;">${char.attacks || ''}</textarea>
                    </div>
                </div>

                <!-- COLUNA 3: PERSONALIDADE E TRAÇOS -->
                <div class="column">
                    ${['Traços de Personalidade', 'Ideais', 'Ligações', 'Defeitos'].map(trait => `
                        <div style="border:1px solid #000; padding:5px; margin-bottom:10px;">
                            <label style="font-size:8px;">${trait.toUpperCase()}</label>
                            <textarea id="char-${trait.toLowerCase().replace(/ /g, '-')}" style="width:100%; height:40px; font-size:9px; border:none; resize:none;">${char.traits?.[trait] || ''}</textarea>
                        </div>
                    `).join('')}
                    
                    <div style="border:1px solid #000; padding:10px; height: 300px;">
                        <label style="font-size:8px;">CARACTERÍSTICAS E HABILIDADES</label>
                        <textarea id="char-features" style="width:100%; height:90%; font-size:9px; border:none; resize:none;">${char.features || ''}</textarea>
                    </div>
                </div>

                <div style="grid-column: span 3; margin-top: 2rem;">
                    <button class="grimoire-btn" style="width:100%; border-color:#000; color:#000; background:#eee;" onclick="window.app.saveCharacter()">💾 CONCLUIR E SALVAR FICHA PRO</button>
                </div>
            </div>
            <style>
                .sheet-pro label { display: block; font-size: 7px; text-transform: uppercase; color: #555; }
            </style>
        `;
    }
};
