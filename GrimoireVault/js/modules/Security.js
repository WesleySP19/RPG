/**
 * Grimoire Security Module
 * HTML Sanitization for safe user-generated content.
 */
export const Security = {
    sanitize(html) {
        const div = document.createElement('div');
        div.textContent = html;
        let clean = div.innerHTML;
        
        // Allow some basic formatting if needed in the future
        // For now, absolute safety:
        return clean.replace(/<script/gi, '&lt;script').replace(/on\w+=/gi, '');
    },

    generateKey(secret) {
        // Simple deterministic key for demo persistence
        return btoa(secret).substring(0, 12).toUpperCase();
    }
};
