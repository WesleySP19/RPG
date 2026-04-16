/**
 * Router.js - Vanilla Hash Router for SPA
 */

export class Router {
    constructor(routes = {}) {
        this.routes = routes;
        this.rootElement = document.getElementById('app-root') || document.body;
        
        window.addEventListener('hashchange', this._handleHashChange.bind(this));
    }

    init() {
        // Trigger for the initial load
        if (!window.location.hash) {
            window.location.hash = '#login';
        } else {
            this._handleHashChange();
        }
    }

    _handleHashChange() {
        const hash = window.location.hash.slice(1) || 'login';
        const route = this.routes[hash];

        if (route) {
            this.rootElement.innerHTML = '';
            
            // Create the new component mapped to the route and mount it
            const component = document.createElement(route.component);
            this.rootElement.appendChild(component);
            
            if (route.onEnter) {
                route.onEnter();
            }
        } else {
            console.error(`Route not found for hash: ${hash}`);
            window.location.hash = '#login';
        }
    }
}
