import { socketService } from './SocketService.js';

export const Network = {
    sessionKey: null,
    onMessageCallback: null,

    connect(sessionKey, onMessage) {
        this.sessionKey = sessionKey;
        this.onMessageCallback = onMessage;

        socketService.connect(() => {
            socketService.subscribe(`/topic/session/${sessionKey}`, (data) => {
                if (this.onMessageCallback) this.onMessageCallback(data);
            });
        }, (error) => {
            console.error("Erro na rede arcana:", error);
        });
    },

    send(route, payload) {
        // Mapeia o estilo de 'route' antigo para destinos STOMP
        // No MessageController definimos /roll, /action e /sync
        let subPath = route;
        if (route === 'sync') subPath = 'sync';
        if (route === 'roll') subPath = 'roll';
        
        const destination = `/app/session/${this.sessionKey}/${subPath}`;
        socketService.send(destination, payload);
    },

    broadcast(type, data) {
        // Antigamente chamava send('sync', ...)
        this.send('sync', { type, ...data });
    }
};

