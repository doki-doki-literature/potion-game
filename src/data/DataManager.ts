import Phaser from 'phaser';

export class DataManager {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    loadJSON(key: string, path: string) {
        this.scene.load.json(key, path);
    }

    getJSON(key: string) {
        return this.scene.cache.json.get(key);
    }
}