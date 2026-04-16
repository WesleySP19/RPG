export class TacticalMap {
    constructor(canvasId, initialState = [], onStateChange = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 40;
        this.tokens = initialState;
        this.onStateChange = onStateChange;
        this.isDragging = false;
        this.draggedToken = null;
        
        this.setupEvents();
        this.render();
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.draggedToken = this.tokens.find(t => {
                return Math.sqrt((x - t.x)**2 + (y - t.y)**2) < 20;
            });

            if (this.draggedToken) this.isDragging = true;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const rect = this.canvas.getBoundingClientRect();
            this.draggedToken.x = e.clientX - rect.left;
            this.draggedToken.y = e.clientY - rect.top;
            this.render();
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging && this.draggedToken) {
                // Snap to Grid
                this.draggedToken.x = Math.round(this.draggedToken.x / this.cellSize) * this.cellSize;
                this.draggedToken.y = Math.round(this.draggedToken.y / this.cellSize) * this.cellSize;
                
                if (this.onStateChange) this.onStateChange(this.tokens);
                this.render();
            }
            this.isDragging = false;
            this.draggedToken = null;
        });
    }

    addToken(name, color = '#5E1F2D') {
        const x = this.cellSize / 2;
        const y = this.cellSize / 2;
        this.tokens.push({ id: Date.now(), name, color, x, y });
        if (this.onStateChange) this.onStateChange(this.tokens);
        this.render();
    }

    clear() {
        this.tokens = [];
        if (this.onStateChange) this.onStateChange(this.tokens);
        this.render();
    }

    render() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        // Draw Grid
        this.ctx.strokeStyle = 'rgba(184, 155, 75, 0.2)';
        this.ctx.beginPath();
        for (let x = 0; x <= width; x += this.cellSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += this.cellSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        this.ctx.stroke();

        // Draw Tokens
        this.tokens.forEach(t => {
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
            this.ctx.fillStyle = t.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#B89B4B';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#1A1A1A';
            this.ctx.font = '10px Lato';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t.name.substring(0, 5), t.x, t.y + 3);
        });
    }
}
