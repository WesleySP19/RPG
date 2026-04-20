
export const Network = {
    socket: null,
    sessionKey: null,
    onMessageCallback: null,
    endpoint: 'wss://YOUR_AWS_API_GATEWAY_URL.com/prod', // User must replace this after deployment

    connect(sessionKey, onMessage) {
        this.sessionKey = sessionKey;
        this.onMessageCallback = onMessage;

        try {
            this.socket = new WebSocket(this.endpoint);

            this.socket.onopen = () => {
                console.log("Fluxo Arcano Conectado.");
                this.send('join', { sessionKey });
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (this.onMessageCallback) this.onMessageCallback(data);
            };

            this.socket.onclose = () => {
                console.warn("Conexão perdida. Tentando reconectar...");
                setTimeout(() => this.connect(sessionKey, onMessage), 3000);
            };

            this.socket.onerror = (e) => console.error("Erro na rede arcana:", e);

        } catch (e) {
            console.error("Não foi possível estabelecer o fluxo:", e);
        }
    },

    send(route, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {
                action: route,
                sessionKey: this.sessionKey,
                payload
            };
            this.socket.send(JSON.stringify(message));
        }
    },

    broadcast(type, data) {
        this.send('sync', { type, ...data });
    }
};

