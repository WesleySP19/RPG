export class SocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.serverUrl = 'http://localhost:8080/ws-grimoire';
    }

    connect(onConnected, onError) {
        console.log("⚡ [Socket] Tentando conexão com o Éter...");
        const socket = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(socket);

        // Ocultar logs do STOMP para manter console limpo se desejar
        // this.stompClient.debug = null;

        const token = localStorage.getItem('grimoire_token');
        const headers = {
            'Authorization': 'Bearer ' + token
        };

        this.stompClient.connect(headers, (frame) => {
            console.log('✔ [Socket] Conectado: ' + frame);
            if (onConnected) onConnected(frame);
        }, (error) => {
            console.error('❌ [Socket] Erro STOMP:', error);
            if (onError) onError(error);
        });
    }

    subscribe(topic, callback) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ [Socket] Tentativa de inscrição sem conexão ativa.");
            return;
        }
        
        console.log(`📡 [Socket] Inscrito em: ${topic}`);
        const sub = this.stompClient.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
        });
        this.subscriptions.set(topic, sub);
    }

    send(destination, payload) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ [Socket] Tentativa de envio sem conexão ativa.");
            return;
        }
        this.stompClient.send(destination, {}, JSON.stringify(payload));
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.subscriptions.clear();
        }
        console.log("🔌 [Socket] Desconectado.");
    }
}

export const socketService = new SocketService();
