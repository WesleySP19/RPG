/**
 * Sanitizer.js - Security Middleware
 * Prevents XSS by sanitizing user-generated content.
 */

export const Sanitizer = {
    /**
     * Escapes HTML characters.
     */
    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * More aggressive sanitization for complex content.
     */
    clean(str) {
        return str.replace(/[^\w\s\d,.\-?!]/gi, ''); // Very restrictive for demo
    }
};
