/**
 * DiceEngine Component
 * Visual 3D animations for Vanilla JS. 
 */
export const DiceEngine = {
    roll(result, isCritical) {
        // Create an overlay to host the 3D dice
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const dice = document.createElement('div');
        const color = isCritical ? '#E5C100' : (result === 1 ? '#ff4444' : '#B89B4B');
        
        dice.style.width = '100px';
        dice.style.height = '100px';
        dice.style.background = `linear-gradient(135deg, ${color}, #000)`;
        dice.style.color = 'white';
        dice.style.fontFamily = 'Cinzel, serif';
        dice.style.fontSize = '40px';
        dice.style.fontWeight = 'bold';
        dice.style.display = 'flex';
        dice.style.alignItems = 'center';
        dice.style.justifyContent = 'center';
        dice.style.borderRadius = '20px';
        dice.style.boxShadow = `0 0 30px ${color}`;
        dice.style.transformStyle = 'preserve-3d';
        
        // Keyframe animation injected inline using Web Animations API
        const animation = dice.animate([
            { transform: 'translateY(-500px) rotateX(0deg) rotateY(0deg)', opacity: 0 },
            { transform: 'translateY(100px) rotateX(360deg) rotateY(180deg)', opacity: 1, offset: 0.5 },
            { transform: 'translateY(-50px) rotateX(540deg) rotateY(360deg)', offset: 0.7 },
            { transform: 'translateY(0px) rotateX(720deg) rotateY(360deg)', opacity: 1, offset: 0.9 },
            { transform: 'translateY(0px) rotateX(720deg) rotateY(360deg) scale(1.5)', opacity: 0, offset: 1 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
        });

        // Set the final number halfway through animation
        setTimeout(() => { dice.innerText = result; }, 700);

        overlay.appendChild(dice);
        document.body.appendChild(overlay);

        animation.onfinish = () => {
            document.body.removeChild(overlay);
        };
    }
};
