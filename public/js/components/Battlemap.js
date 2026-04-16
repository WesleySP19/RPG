import { BaseComponent } from '../core/BaseComponent.js';

/**
 * <rpg-battlemap> v2.0
 * Features optimized multi-layer canvas and Particle System for Production polish.
 */
export class RpgBattlemap extends BaseComponent {
    constructor() {
        super();
        this.tokens = [
            { id: 1, x: 100, y: 100, color: '#4A90E2', radius: 20, name: 'Kael' },
            { id: 2, x: 300, y: 200, color: '#D0021B', radius: 20, name: 'Orc' }
        ];
        this.particles = [];
        this.isDragging = false;
        this.draggedToken = null;
        this.cellSize = 50;
        this.needsRedraw = true;
    }

    onMount() {
        this.container = this.querySelector('.map-wrapper');
        this.canvasStatic = this.querySelector('#layer-static');
        this.canvasDynamic = this.querySelector('#layer-dynamic');
        this.canvasFx = this.querySelector('#layer-fx');
        
        this.ctxStatic = this.canvasStatic.getContext('2d', { alpha: false });
        this.ctxDynamic = this.canvasDynamic.getContext('2d');
        this.ctxFx = this.canvasFx.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupEventDelegation();
        
        this.renderLoop();
    }

    setupEventDelegation() {
        this.canvasFx.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvasFx.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        [this.canvasStatic, this.canvasDynamic, this.canvasFx].forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });

        this.drawStaticLayer(width, height);
        this.needsRedraw = true;
    }

    drawStaticLayer(width, height) {
        this.ctxStatic.fillStyle = '#050505';
        this.ctxStatic.fillRect(0, 0, width, height);

        this.ctxStatic.strokeStyle = 'rgba(212, 175, 55, 0.1)';
        this.ctxStatic.lineWidth = 1;

        this.ctxStatic.beginPath();
        for (let x = 0; x <= width; x += this.cellSize) {
            this.ctxStatic.moveTo(x, 0);
            this.ctxStatic.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += this.cellSize) {
            this.ctxStatic.moveTo(0, y);
            this.ctxStatic.lineTo(width, y);
        }
        this.ctxStatic.stroke();
    }

    onMouseDown(e) {
        const rect = this.canvasFx.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.draggedToken = this.tokens.find(t => {
            const dx = x - t.x;
            const dy = y - t.y;
            return Math.sqrt(dx*dx + dy*dy) < t.radius;
        });

        if (this.draggedToken) {
            this.isDragging = true;
            this.createExplosion(x, y, this.draggedToken.color);
            this.triggerShake();
        }
    }

    triggerShake() {
        this.container.classList.remove('anim-shake');
        void this.container.offsetWidth;
        this.container.classList.add('anim-shake');
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.draggedToken) return;
        const rect = this.canvasFx.getBoundingClientRect();
        this.draggedToken.x = e.clientX - rect.left;
        this.draggedToken.y = e.clientY - rect.top;
        this.needsRedraw = true;
    }

    onMouseUp() {
        this.isDragging = false;
        this.draggedToken = null;
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            });
        }
    }

    renderLoop() {
        if (this.needsRedraw) {
            this.drawDynamicLayer();
            this.needsRedraw = false;
        }
        this.drawFxLayer();
        requestAnimationFrame(() => this.renderLoop());
    }

    drawDynamicLayer() {
        const { width, height } = this.canvasDynamic;
        this.ctxDynamic.clearRect(0, 0, width, height);

        // Fog
        this.ctxDynamic.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctxDynamic.fillRect(0, 0, width, height);
        
        this.ctxDynamic.globalCompositeOperation = 'destination-out';
        this.tokens.forEach(t => {
            const grad = this.ctxDynamic.createRadialGradient(t.x, t.y, 0, t.x, t.y, 150);
            grad.addColorStop(0, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctxDynamic.fillStyle = grad;
            this.ctxDynamic.beginPath();
            this.ctxDynamic.arc(t.x, t.y, 150, 0, Math.PI * 2);
            this.ctxDynamic.fill();
        });

        this.ctxDynamic.globalCompositeOperation = 'source-over';
        this.tokens.forEach(t => {
            this.ctxDynamic.beginPath();
            this.ctxDynamic.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            this.ctxDynamic.fillStyle = t.color;
            this.ctxDynamic.fill();
            this.ctxDynamic.strokeStyle = '#fff';
            this.ctxDynamic.lineWidth = 2;
            this.ctxDynamic.stroke();
        });
    }

    drawFxLayer() {
        const { width, height } = this.canvasFx;
        this.ctxFx.clearRect(0, 0, width, height);

        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) return false;

            this.ctxFx.globalAlpha = p.life;
            this.ctxFx.fillStyle = p.color;
            this.ctxFx.beginPath();
            this.ctxFx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctxFx.fill();
            return true;
        });
        this.ctxFx.globalAlpha = 1.0;
    }

    template() {
        return `
            <style>
                .map-wrapper { position: relative; width: 100%; height: 100%; background: #000; overflow: hidden; }
                .map-wrapper canvas { position: absolute; top: 0; left: 0; }
                #layer-fx { cursor: crosshair; }
            </style>
            <div class="map-wrapper">
                <canvas id="layer-static"></canvas>
                <canvas id="layer-dynamic"></canvas>
                <canvas id="layer-fx"></canvas>
            </div>
        `;
    }
}

customElements.define('rpg-battlemap', RpgBattlemap);
