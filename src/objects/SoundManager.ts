import * as Phaser from "phaser";

export class SoundManager {
    private scene: Phaser.Scene;
    sounds: any = {};

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
        this.scene.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3');
    }

    create(key: string) {
        this.sounds[key] = this.scene.sound.add(key);
    }

    play(key: string) {
        this.sounds[key].play({ loop: true, volume: 0.05 });
    }

    pause(key: string) {
        this.sounds[key].pause();
    }

    stop(key: string) {
        this.sounds[key].stop();
    }
}
