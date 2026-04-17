/**
 * SRDViewer Component
 * Navigator for the Arcane Compendium (Rules, Items, Spells).
 */
export const SRDViewer = {
    render(data, category = 'items') {
        const list = data[category] || [];
        return `
            <div class="srd-browser">
                <div style="display:flex; gap:10px; margin-bottom:1rem;">
                    <button class="grimoire-btn" style="flex:1; font-size:10px; ${category==='items'?'border-color:#B89B4B':''}" onclick="window.app.showSRD('items')">ITENS</button>
                    <button class="grimoire-btn" style="flex:1; font-size:10px; ${category==='spells'?'border-color:#B89B4B':''}" onclick="window.app.showSRD('spells')">MAGIAS</button>
                    <button class="grimoire-btn" style="flex:1; font-size:10px; ${category==='monsters'?'border-color:#B89B4B':''}" onclick="window.app.showSRD('monsters')">BESTIÁRIO</button>
                </div>
                <div class="scroll-panel" style="max-height:300px;">
                    ${list.map(item => `
                        <div class="srd-item list-item" draggable="true" 
                             ondragstart="event.dataTransfer.setData('text/plain', JSON.stringify({ category: '${category}', item: '${item.name}' }))"
                             style="padding:10px; margin-bottom:10px; border:1px solid rgba(184,155,75,0.2); cursor:grab;">
                            <div style="display:flex; justify-content:space-between; align-items:start;">
                                <strong>${item.name}</strong>
                                <button class="grimoire-btn" style="font-size:9px; padding:2px 8px;" onclick="window.app.addItemToSheet('${category}', '${item.name}')">+ ADD</button>
                            </div>
                            <div style="font-size:10px; opacity:0.7; margin-top:5px;">
                                ${item.desc || item.properties || `CR: ${item.cr} | HP: ${item.hp}`}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
