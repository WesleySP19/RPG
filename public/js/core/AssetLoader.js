/**
 * AssetLoader.js - Centralized Resource Orchestrator
 * Handles images and audio with progress tracking.
 */

export class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.total = 0;
        this.loaded = 0;
        this.onProgress = null;
    }

    /**
     * Loads multiple assets and tracks progress.
     * @param {Object} manifest - { name: path }
     */
    async loadAll(manifest) {
        const keys = Object.keys(manifest);
        this.total = keys.length;
        this.loaded = 0;

        const promises = keys.map(async (key) => {
            const url = manifest[key];
            const type = this._getType(url);
            
            let asset;
            if (type === 'image') {
                asset = await this._loadImage(url);
            } else if (type === 'audio') {
                asset = await this._loadAudio(url);
            }

            this.cache.set(key, asset);
            this.loaded++;
            if (this.onProgress) this.onProgress(this.loaded / this.total);
            return asset;
        });

        return Promise.all(promises);
    }

    get(key) {
        return this.cache.get(key);
    }

    _getType(url) {
        if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(url)) return 'image';
        if (/\.(mp3|wav|ogg)$/i.test(url)) return 'audio';
        return 'unknown';
    }

    _loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }

    _loadAudio(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
            audio.src = url;
        });
    }
}

export const assets = new AssetLoader();
