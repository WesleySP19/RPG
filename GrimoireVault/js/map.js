export class TacticalMap {
    constructor(canvasId, initialState = [], onStateChange = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // State
        this.cellSize = 40;
        this.tokens = initialState;
        this.onStateChange = onStateChange;
        this.backgroundImage = null;
        
        // Transform State (Pan & Zoom)
        this.transform = {
            x: 0,
            y: 0,
            scale: 1
        };
        
        // Interaction State
        this.isDragging = false;
        this.isPanning = false;
        this.draggedToken = null;
        this.lastMousePos = { x: 0, y: 0 };
        
        this.setupEvents();
        this.startRenderLoop();
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const pos = this.getMousePos(e);
            const worldPos = this.screenToWorld(pos.x, pos.y);

            // Check for token click
            this.draggedToken = this.tokens.find(t => {
                const dist = Math.sqrt((worldPos.x - t.x)**2 + (worldPos.y - t.y)**2);
                return dist < (this.cellSize * 0.45);
            });

            if (this.draggedToken) {
                this.isDragging = true;
            } else {
                this.isPanning = true;
                this.lastMousePos = { x: e.clientX, y: e.clientY };
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const pos = this.getMousePos(e);
            
            if (this.isDragging && this.draggedToken) {
                const worldPos = this.screenToWorld(pos.x, pos.y);
                this.draggedToken.x = worldPos.x;
                this.draggedToken.y = worldPos.y;
            } else if (this.isPanning) {
                const dx = e.clientX - this.lastMousePos.x;
                const dy = e.clientY - this.lastMousePos.y;
                this.transform.x += dx;
                this.transform.y += dy;
                this.lastMousePos = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging && this.draggedToken) {
                // Snap to Grid (World Space)
                this.draggedToken.x = Math.round(this.draggedToken.x / this.cellSize) * this.cellSize;
                this.draggedToken.y = Math.round(this.draggedToken.y / this.cellSize) * this.cellSize;
                
                if (this.onStateChange) this.onStateChange(this.tokens);
            }
            this.isDragging = false;
            this.isPanning = false;
            this.draggedToken = null;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const pos = this.getMousePos(e);
            const zoomSpeed = 0.001;
            const delta = -e.deltaY;
            const factor = Math.pow(1.1, delta / 100);
            
            const newScale = Math.max(0.2, Math.min(5, this.transform.scale * factor));
            
            // Zoom at mouse position
            const worldPos = this.screenToWorld(pos.x, pos.y);
            this.transform.scale = newScale;
            
            const newScreenPos = this.worldToScreen(worldPos.x, worldPos.y);
            this.transform.x += pos.x - newScreenPos.x;
            this.transform.y += pos.y - newScreenPos.y;
        }, { passive: false });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    screenToWorld(x, y) {
        return {
            x: (x - this.transform.x) / this.transform.scale,
            y: (y - this.transform.y) / this.transform.scale
        };
    }

    worldToScreen(x, y) {
        return {
            x: x * this.transform.scale + this.transform.x,
            y: y * this.transform.scale + this.transform.y
        };
    }

    setBackground(imageSrc) {
        const img = new Image();
        img.onload = () => {
            this.backgroundImage = img;
        };
        img.src = imageSrc;
    }

    addToken(name, color = '#5E1F2D') {
        const center = this.screenToWorld(this.canvas.width / 2, this.canvas.height / 2);
        this.tokens.push({ 
            id: Date.now(), 
            name, 
            color, 
            x: Math.round(center.x / this.cellSize) * this.cellSize, 
            y: Math.round(center.y / this.cellSize) * this.cellSize 
        });
        if (this.onStateChange) this.onStateChange(this.tokens);
    }

    clear() {
        this.tokens = [];
        if (this.onStateChange) this.onStateChange(this.tokens);
    }

    startRenderLoop() {
        const render = () => {
            this.draw();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    draw() {
        const { width, height } = this.canvas;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);

        // Apply Transformation
        this.ctx.translate(this.transform.x, this.transform.y);
        this.ctx.scale(this.transform.scale, this.transform.scale);

        // 1. Draw Background Image
        if (this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0);
        }

        // 2. Draw Grid
        this.ctx.strokeStyle = 'rgba(184, 155, 75, 0.2)';
        this.ctx.lineWidth = 1 / this.transform.scale;
        this.ctx.beginPath();
        
        // Draw enough grid to cover the viewport roughly
        const worldStart = this.screenToWorld(0, 0);
        const worldEnd = this.screenToWorld(width, height);
        
        const startX = Math.floor(worldStart.x / this.cellSize) * this.cellSize;
        const startY = Math.floor(worldStart.y / this.cellSize) * this.cellSize;
        const endX = Math.ceil(worldEnd.x / this.cellSize) * this.cellSize;
        const endY = Math.ceil(worldEnd.y / this.cellSize) * this.cellSize;

        for (let x = startX; x <= endX; x += this.cellSize) {
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
        }
        for (let y = startY; y <= endY; y += this.cellSize) {
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
        }
        this.ctx.stroke();

        // 3. Draw Tokens
        this.tokens.forEach(t => {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, this.cellSize * 0.45, 0, Math.PI * 2);
            this.ctx.fillStyle = t.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#B89B4B';
            this.ctx.lineWidth = 2 / this.transform.scale;
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = `${10 / this.transform.scale}px Lato`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t.name.substring(0, 8), t.x, t.y + (3 / this.transform.scale));
            this.ctx.restore();
        });
    }
}

