import { GameData } from '../../shared/GameData.js';
import { CharacterLogic } from '../core/CharacterLogic.js';

export const CharacterSheet = {
    render(char = {}) {


        return `
            <div class="builder-layout">
                <aside id="builder-sidebar" class="builder-panel"></aside>
                <div id="builder-preview" class="preview-area">
                    <div id="hero-card-preview" class="card-area"></div>
                    <div id="hero-sheet-preview" class="sheet-area scroll-panel"></div>
                </div>
            </div>
        `;
    },

    renderCreator(char = {}) {
        const stats = ['for', 'des', 'con', 'int', 'sab', 'car'];
        return `
            <h2 class="ornament" style="font-size:1.2rem;">Criador de Heróis</h2>
            <div class="ornament-divider"></div>

            <div class="input-group">
                <label>Nome do Herói</label>
                <input type="text" id="builder-name" class="grimoire-input" value="${char.name || ''}" oninput="window.app.updateBuilderPreview()">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:1rem;">
                <div class="input-group">
                    <label>Raça</label>
                    <select id="builder-race" class="grimoire-input" onchange="window.app.updateBuilderPreview()">
                        ${['Humano', 'Elfo', 'Anão', 'Draconato', 'Tiefling', 'Halfling'].map(r => `<option value="${r}" ${char.race===r?'selected':''}>${r}</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Classe</label>
                    <select id="builder-class" class="grimoire-input" onchange="window.app.updateBuilderPreview()">
                        ${Object.keys(GameData.classes).map(c => `<option value="${c}" ${char.class===c?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
            </div>

            
            <div class="glass-panel" style="margin-top:2rem; padding:15px; border-color:var(--clr-gold);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <label style="margin:0;">Atributos</label>
                    <button class="grimoire-btn" style="font-size:10px; padding:5px 10px;" onclick="window.app.rollBuilderStats()">🎲 ROLAR 4D6</button>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    ${stats.map(s => `
                        <div class="attr-input-group">
                            <label style="font-size:10px;">${s.toUpperCase()}</label>
                            <input type="number" id="builder-attr-${s}" class="grimoire-input attr-field" value="${char.attributes?.[s] || 10}" onchange="window.app.updateBuilderPreview()">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="input-group">
                <label>Experiência (XP)</label>
                <input type="number" id="builder-xp" class="grimoire-input" value="${char.xp || 0}" oninput="window.app.updateBuilderPreview()">
                <div id="level-preview" style="font-size:0.7rem; color:var(--clr-gold); margin-top:5px;">Próximo Nível: ${GameData.xpTable[(char.level || 1)] || 'MAX'} XP</div>
            </div>

            <div class="input-group" style="margin-top:1.5rem;">
                <label>História / Origem</label>
                <div style="position:relative;">
                    <textarea id="builder-bg" class="grimoire-input" style="height:100px; padding-top:2rem;" oninput="window.app.updateBuilderPreview()">${char.background || ''}</textarea>
                    <button class="grimoire-btn-icon" style="position:absolute; top:5px; left:5px; font-size:0.7rem; padding:2px 8px;" onclick="window.app.generateAIBio()">🔮 IA: Gerar História</button>
                </div>
            </div>

            
            <div id="builder-advice" class="builder-hint">
                Selecione uma classe para ver as recomendações de atributos.
            </div>
        `;
    },

    renderCard(char = {}) {
        const raceClass = `${char.race || 'Raça'} ${char.class || 'Classe'}`;
        const hp = char.hpCurrent || 10;
        const hpMax = char.hpMax || 10;
        const ac = char.ac || 10;
        const xp = char.xp || 0;
        const level = char.level || 1;
        const nextXp = GameData.xpTable[level] || 355000;
        const xpPercent = Math.min((xp / nextXp) * 100, 100);
        const hpPercent = Math.min((hp / hpMax) * 100, 100);

        return `
            <div class="card-container" onclick="this.querySelector('.hero-card').classList.toggle('flipped')">
                <div class="hero-card">
                    
                    <div class="card-face card-front">
                        <div class="card-banner" style="background-image: url('${char.avatar || 'https://i.pinimg.com/736x/8d/f6/8d/8df68dcd2f33e5acc937e0086d061765.jpg'}')">
                            <div class="card-level-badge">LV ${level}</div>
                        </div>
                        <div class="card-info">
                            <h2 class="ornament">${char.name || 'Nome do Herói'}</h2>
                            <p style="opacity:0.6; font-size:0.9rem; margin-bottom:10px;">${raceClass}</p>
                            
                            <div style="text-align:left; font-size:10px; margin-bottom:5px;">VIGOR (HP)</div>
                            <div class="status-bar-container">
                                <div class="status-bar-fill hp-bar" style="width: ${hpPercent}%"></div>
                            </div>

                            <div style="text-align:left; font-size:10px; margin-top:10px; margin-bottom:5px;">MAGIA (XP)</div>
                            <div class="status-bar-container">
                                <div class="status-bar-fill xp-bar" style="width: ${xpPercent}%"></div>
                            </div>
                            
                            <div class="card-stats-grid">
                                <div><small>ATK</small><br><strong style="color:var(--clr-gold);">+${CharacterLogic.getModifier(char.attributes?.for || 10) + CharacterLogic.getProficiencyBonus(level)}</strong></div>
                                <div><small>DEF</small><br><strong style="color:var(--clr-gold);">${ac}</strong></div>
                                <div><small>INIT</small><br><strong style="color:var(--clr-gold);">+${CharacterLogic.getModifier(char.attributes?.des || 10)}</strong></div>
                            </div>
                        </div>
                    </div>

                    
                    <div class="card-face card-back">
                        <h3 class="ornament" style="font-size:1rem; color:var(--clr-gold) !important;">Inventário Arcano</h3>
                        <div class="ornament-divider"></div>
                        
                        <div class="scroll-panel" style="flex:1; font-size:0.8rem; text-align:left;">
                            <ul style="list-style:none; padding:0;">
                                <li style="border-bottom:1px solid rgba(184,155,75,0.2); padding:5px 0;">⚔️ Espada Longa (1d8)</li>
                                <li style="border-bottom:1px solid rgba(184,155,75,0.2); padding:5px 0;">🛡️ Escudo (+2 CA)</li>
                                <li style="border-bottom:1px solid rgba(184,155,75,0.2); padding:5px 0;">🎒 Mochila do Aventureiro</li>
                                <li style="border-bottom:1px solid rgba(184,155,75,0.2); padding:5px 0;">🧪 Poção de Cura (x2)</li>
                            </ul>
                        </div>

                        <div style="border-top:1px solid var(--clr-gold); padding-top:10px;">
                            <h3 class="ornament" style="font-size:0.9rem;">Habilidades</h3>
                            <p style="font-size:0.7rem; opacity:0.7;">Fúria, Sentido de Perigo, Ataque Descuidado.</p>
                        </div>

                        <div style="font-size:0.7rem; color:var(--clr-gold); margin-top:auto;">
                            D&D 5E • GRIMOIRE ARCHITECT
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSheet(char = {}) {
        const level = char.level || 1;
        const prof = CharacterLogic.getProficiencyBonus(level);
        const weight = CharacterLogic.calculateTotalWeight(char.inventory);
        const maxWeight = (char.attributes?.for || 10) * 15;
        
        return `
            <div class="parchment-sheet sheet-bg">
                <header class="sheet-header" style="margin-bottom: 2rem;">
                    <div class="sheet-title">
                        <h1 class="ornament" style="font-size:3rem; margin:0; line-height:1; color: var(--clr-wine);">${char.name || 'Herói Sem Nome'}</h1>
                        <p style="font-size:1.2rem; color: #5e1f2d; opacity:0.8; font-weight: bold;">${char.race || 'Humano'} • ${char.class || 'Guerreiro'} • Nível ${level}</p>
                    </div>
                </header>

                <div style="display:grid; grid-template-columns: 120px 1fr 1fr; gap:2rem;">
                    
                    <div class="sheet-attributes">
                        ${['for', 'des', 'con', 'int', 'sab', 'car'].map(key => {
                            const val = char.attributes?.[key] || 10;
                            const mod = CharacterLogic.getModifier(val);
                            return `
                                <div class="sheet-attr-box" style="background:rgba(255,255,255,0.5); border: 2px solid #d4c4a8; border-radius: 8px; padding: 10px; margin-bottom: 10px; text-align: center;">
                                    <label style="text-transform:uppercase; font-size: 10px; display: block; color: #5e1f2d;">${key}</label>
                                    <div style="font-size: 1.5rem; font-weight: bold; color: #5e1f2d;">${mod >= 0 ? '+' : ''}${mod}</div>
                                    <div style="font-size: 10px; opacity: 0.7;">${val}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    
                    <div>
                        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom: 1.5rem;">
                            <div style="background:#fff; border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px; text-align: center;">
                                <label style="font-size:10px; display: block;">DEFESA (CA)</label>
                                <span style="font-size:2rem; font-weight: bold; color: #5e1f2d;">${CharacterLogic.calculateAC(char)}</span>
                            </div>
                            <div style="background:#fff; border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px; text-align: center;">
                                <label style="font-size:10px; display: block;">INICIATIVA</label>
                                <span style="font-size:2rem; font-weight: bold; color: #5e1f2d;">+${CharacterLogic.getModifier(char.attributes?.des || 10)}</span>
                            </div>
                            <div style="background:#fff; border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px; text-align: center;">
                                <label style="font-size:10px; display: block;">PROFC.</label>
                                <span style="font-size:2rem; font-weight: bold; color: #5e1f2d;">+${prof}</span>
                            </div>
                        </div>

                        <div style="background:#fff; border: 2px solid #5e1f2d; border-radius: 10px; padding: 15px; text-align: center; margin-bottom: 2rem;">
                            <label style="color:#5e1f2d; font-weight: bold;">PONTOS DE VIDA (PV)</label>
                            <div style="font-size:2.5rem; font-weight:bold; color:#5e1f2d;">${char.hpCurrent || 10} / ${char.hpMax || 10}</div>
                        </div>

                        <div style="background:rgba(255,255,255,0.5); border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px;">
                            <h3 class="ornament" style="font-size:0.9rem; margin-top:0;">PERÍCIAS</h3>
                            <div class="ornament-divider"></div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                                ${GameData.skills.map(s => {
                                    const isProf = char.proficiencies?.includes(s.name);
                                    const bonus = CharacterLogic.calculateSkill(char, s.name, s.attr, isProf);
                                    return `
                                        <div style="font-size: 0.7rem; display: flex; align-items:center; gap: 5px; opacity: ${isProf ? '1' : '0.6'}">
                                            <span style="width:8px; height:8px; border-radius:50%; border:1px solid #5e1f2d; background:${isProf ? '#5e1f2d' : 'transparent'}"></span>
                                            <b style="min-width: 20px;">${bonus >= 0 ? '+' : ''}${bonus}</b>
                                            <span>${s.name}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    
                    <div>
                        <div style="background:rgba(255,255,255,0.5); border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px; margin-bottom: 1.5rem;">
                            <h3 class="ornament" style="font-size:0.9rem; margin-top:0;">INVENTÁRIO</h3>
                            <div style="font-size: 0.7rem; opacity: 0.7; margin-bottom: 10px;">Carga: ${weight} / ${maxWeight} kg</div>
                            <div class="ornament-divider"></div>
                            <div style="font-size: 0.8rem; line-height: 1.6;">
                                ${(char.inventory || []).length > 0 ? char.inventory.map(i => `• ${i.name} (${i.weight}kg)`).join('<br>') : 'Nenhum item equipado.'}
                            </div>
                        </div>

                        <div style="background:rgba(255,255,255,0.5); border: 2px solid #d4c4a8; border-radius: 10px; padding: 15px; height: 350px; overflow-y: auto;">
                            <h3 class="ornament" style="font-size:0.9rem; margin-top:0;">GRIMÓRIO EXECUTIVO</h3>
                            <div class="ornament-divider"></div>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                ${[1, 2, 3].map(lvl => `
                                    <div style="font-size:0.8rem;">
                                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                            <b>NÍVEL ${lvl}</b>
                                            <span>Slots: ◯ ◯ ◯</span>
                                        </div>
                                        <div style="font-size:0.7rem; opacity:0.7; font-style:italic;">Nenhuma magia preparada para este nível.</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

