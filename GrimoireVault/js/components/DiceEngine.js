
export const DiceEngine = {
    roll(result, isCritical) {
        const hud = document.getElementById('dice-hud');
        const value = document.getElementById('dice-value');
        const label = document.getElementById('dice-label');
        const container = document.getElementById('dice-result-container');

        if (!hud || !value || !label || !container) return;

        container.classList.remove('critical-success', 'critical-failure');

        value.innerText = result;
        
        if (isCritical) {
            label.innerText = 'SUCESSO CRÍTICO!';
            container.classList.add('critical-success');
            this.spawnFloatingText('ESPETACULAR!', 'var(--clr-gold-light)');
        } else if (result === 1) {
            label.innerText = 'FALHA CRÍTICA!';
            container.classList.add('critical-failure');
            this.spawnFloatingText('DESASTRE!', '#ff4444');
        } else {
            label.innerText = 'RITUAL DE DADO';
        }

        hud.classList.add('active');

        setTimeout(() => {
            hud.classList.remove('active');
        }, 3000);
    },

    spawnFloatingText(text, color) {
        const span = document.createElement('span');
        span.className = 'floating-text';
        span.innerText = text;
        span.style.color = color;
        span.style.left = (window.innerWidth / 2 - 50) + 'px';
        span.style.top = (window.innerHeight / 2 - 100) + 'px';
        
        document.body.appendChild(span);
        
        setTimeout(() => {
            document.body.removeChild(span);
        }, 2000);
    }
};

