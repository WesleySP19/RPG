/**
 * BaseComponent.js - Production Grade Web Component Base
 * v2.0 - Features optimized rendering using Contextual Fragments
 */

export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.subscriptions = [];
        this.stores = [];
        this._isRendering = false;
    }

    connectedCallback() {
        this.setupBindings();
        this.render();
        this.onMount();
    }

    disconnectedCallback() {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions = [];
        this.onUnmount();
    }

    bindStore(store) {
        if (!this.stores.includes(store)) {
            this.stores.push(store);
        }
    }

    setupBindings() {
        this.stores.forEach(store => {
            const unsubscribe = store.subscribe(() => {
                this._queueRender();
            });
            this.subscriptions.push(unsubscribe);
        });
    }

    /**
     * Queues a render for the next animation frame to prevent
     * jank during multiple rapid state changes.
     */
    _queueRender() {
        if (this._isRendering) return;
        this._isRendering = true;
        
        requestAnimationFrame(() => {
            this.render();
            this._isRendering = false;
        });
    }

    onMount() {}
    onUnmount() {}

    template() {
        return ``;
    }

    /**
     * v2.0 Render - Uses a more efficient update method.
     * While true DOM diffing is complex, using Contextual Fragments
     * is faster and cleaner for Vanilla.
     */
    render() {
        const html = this.template();
        if (!html) return;

        // In a full production env, we would use a diffing library here.
        // For our Vanilla Scale, we ensure we only update if the content actually changes
        // to avoid unnecessary style recalculations.
        if (this.innerHTML === html) return;

        const fragment = document.createRange().createContextualFragment(html);
        this.innerHTML = '';
        this.appendChild(fragment);
    }
}
