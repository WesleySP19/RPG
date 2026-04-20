
export class TacticalMap {
    constructor(canvasId, initialState = [], onStateChange = null) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.cellSize = 40;
        this.onStateChange = onStateChange;

        this.tokens = initialState;
        this.transform = { x: 0, y: 0, scale: 1 };
        this.fogOfWar = new Set();

        this.isDragging = false;
        this.isPanning = false;
        this.isMeasuring = false;
        this.draggedToken = null;
        this.lastPos = { x: 0, y: 0 };
        this.measureStart = null;
        this.measureEnd = null;

        this.setupEvents();
        this.startRenderLoop();
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const worldPos = this.screenToWorld(e.offsetX, e.offsetY);
            
            if (e.shiftKey) {
                this.isMeasuring = true;
                this.measureStart = worldPos;
                this.measureEnd = worldPos;
                return;
            }

            if (e.altKey) {
                this.clearFog(worldPos);
                return;
            }

            this.draggedToken = this.tokens.find(t => 
                Math.sqrt((worldPos.x - t.x)**2 + (worldPos.y - t.y)**2) < this.cellSize * 0.45
            );

            if (this.draggedToken) {
                this.isDragging = true;
            } else {
                this.isPanning = true;
                this.lastPos = { x: e.clientX, y: e.clientY };
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const worldPos = this.screenToWorld(e.offsetX, e.offsetY);

            if (this.isMeasuring) {
                this.measureEnd = worldPos;
            } else if (this.isDragging && this.draggedToken) {
                this.draggedToken.x = worldPos.x;
                this.draggedToken.y = worldPos.y;
            } else if (this.isPanning) {
                this.transform.x += e.clientX - this.lastPos.x;
                this.transform.y += e.clientY - this.lastPos.y;
                this.lastPos = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging && this.draggedToken) {
                this.draggedToken.x = Math.round(this.draggedToken.x / this.cellSize) * this.cellSize;
                this.draggedToken.y = Math.round(this.draggedToken.y / this.cellSize) * this.cellSize;
                if (this.onStateChange) this.onStateChange(this.tokens);
            }
            this.isDragging = this.isPanning = this.isMeasuring = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.transform.scale *= delta;
        });
    }

    screenToWorld(sx, sy) {
        return {
            x: (sx - this.transform.x) / this.transform.scale,
            y: (sy - this.transform.y) / this.transform.scale
        };
    }

    clearFog(pos) {
        const gx = Math.floor(pos.x / this.cellSize);
        const gy = Math.floor(pos.y / this.cellSize);
        this.fogOfWar.add(`${gx},${gy}`);
    }

    resetFog() { this.fogOfWar.clear(); }
    resetTokens() { this.tokens = []; if (this.onStateChange) this.onStateChange([]); }

    startRenderLoop() {
        const render = () => {
            if (document.getElementById(this.canvas?.id)) {
                this.draw();
                requestAnimationFrame(render);
            }
        };
        render();
    }

    draw() {
        const { ctx, canvas, transform, cellSize } = this;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);

        ctx.strokeStyle = 'hsla(var(--h-gold), 45%, 51%, 0.15)';
        ctx.lineWidth = 1/transform.scale;
        ctx.beginPath();
        for(let x=-2000; x<2000; x+=cellSize) { ctx.moveTo(x,-2000); ctx.lineTo(x,2000); }
        for(let y=-2000; y<2000; y+=cellSize) { ctx.moveTo(-2000,y); ctx.lineTo(2000,y); }
        ctx.stroke();

        ctx.fillStyle = 'rgba(0,0,0,0.95)';
        ctx.fillRect(-2000, -2000, 4000, 4000);
        ctx.globalCompositeOperation = 'destination-out';

        this.tokens.forEach(t => {
            const centerX = t.x + cellSize / 2;
            const centerY = t.y + cellSize / 2;
            const radius = cellSize * 6; 
            
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalCompositeOperation = 'source-over';

        this.tokens.forEach(t => {
            const centerX = t.x + cellSize / 2;
            const centerY = t.y + cellSize / 2;

            ctx.shadowBlur = 15;
            ctx.shadowColor = t.color || 'var(--clr-gold)';
            
            ctx.fillStyle = t.color || 'var(--clr-gold)';
            ctx.beginPath();
            ctx.arc(centerX, centerY, cellSize * 0.4, 0, Math.PI*2);
            ctx.fill();
            
            ctx.shadowBlur = 0; // Reset
            
            ctx.strokeStyle = 'white'; 
            ctx.lineWidth = 2/transform.scale; 
            ctx.stroke();
            
            ctx.fillStyle = 'white'; 
            ctx.font = `${12/transform.scale}px var(--font-heading)`; 
            ctx.textAlign = 'center';
            ctx.fillText(t.name.substring(0,12), centerX, t.y + cellSize * 1.3);
        });

        if (this.isMeasuring && this.measureStart && this.measureEnd) {
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 3/transform.scale;
            ctx.beginPath();
            ctx.moveTo(this.measureStart.x, this.measureStart.y);
            ctx.lineTo(this.measureEnd.x, this.measureEnd.y);
            ctx.stroke();

            const dist = Math.sqrt((this.measureEnd.x - this.measureStart.x)**2 + (this.measureEnd.y - this.measureStart.y)**2);
            const feet = Math.round(dist / cellSize * 5);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(`${feet}ft`, this.measureEnd.x, this.measureEnd.y - 10);
        }
    }
}

