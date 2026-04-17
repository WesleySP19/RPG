/**
 * Grimoire State Module
 * Reactive State Management using JavaScript Proxies.
 */
export const State = {
    listeners: [],

    subscribe(fn) {
        this.listeners.push(fn);
        return () => this.listeners = this.listeners.filter(l => l !== fn);
    },

    notify() {
        this.listeners.forEach(fn => fn());
    },

    createStore(initialState) {
        const handler = {
            set: (target, key, value) => {
                target[key] = value;
                this.notify();
                return true;
            }
        };
        return new Proxy(initialState, handler);
    }
};
