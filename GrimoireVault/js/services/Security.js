
export const Security = {
    sanitize(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.textContent = html;
        let clean = div.innerHTML;
        return clean.replace(/<script/gi, '&lt;script').replace(/on\w+=/gi, '');
    },

    
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    
    generateToken(playerId, userTag) {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({
            sub: playerId,
            tag: userTag,
            iat: Date.now(),
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiry
        }));

        const signature = btoa(`grimoire_vault_secret_${playerId}`).substring(0, 20);
        return `${header}.${payload}.${signature}`;
    },

    
    decodeToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const payload = JSON.parse(atob(parts[1]));

            if (payload.exp < Date.now()) {
                console.warn("Security: Token expirado.");
                return null;
            }
            
            return payload;
        } catch (e) {
            console.error("Security: Falha ao decodificar token.", e);
            return null;
        }
    }
};

