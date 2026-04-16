/**
 * app.js - Main Application Entry
 * Initializes Router and bootstraps Web Components
 */

// Import Core
import { playerStore, gmStore } from './core/Store.js';
import { Router } from './core/Router.js';
import { storage } from './services/StorageService.js';
import { assets } from './core/AssetLoader.js';

// Import Components
import './components/UIComponents.js';
import './components/CharacterSheet.js';
import './components/DiceRoller.js';
import './components/ChatLog.js';
import './components/Battlemap.js';
import './components/GMPanel.js';
import './components/Views.js';

// Initialize Router
const router = new Router({
    'login': { component: 'view-login' },
    'dashboard': { component: 'view-dashboard' },
    'mesa': { component: 'view-mesa-player' },
    'mesa-gm': { component: 'view-mesa-gm' }
});

// Boot
window.onload = async () => {
    console.log('⚔️ RPG Forge - Vanilla High-Performance Booting...');

    try {
        // 1. Initialize DB
        await storage.init();

        // 2. Pre-load critical assets (Mock manifest)
        // await assets.loadAll({ 'btn_click': './assets/sfx/click.mp3' });

        // 3. Hydrate store from DB or Use defaults
        const savedPlayer = await storage.get('sessions', 'current_player');
        if (savedPlayer) {
            playerStore.update(savedPlayer);
        } else {
            // Default Hydration
            playerStore.update({
                name: 'Kaelthas',
                hp: 10,
                hpMax: 10,
                level: 3,
                class: 'Sorcerer',
                race: 'Elf'
            });
        }

        console.log('✅ System Ready. Storage & Assets locked.');

        // Start routing
        router.init();

        // 4. Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
                .then(() => console.log('🛡️ Service Worker Registered'))
                .catch(err => console.error('🛡️ SW Registration Failed', err));
        }

    } catch (err) {
        console.error('❌ Boot Failure:', err);
    }
};
