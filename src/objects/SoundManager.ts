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
        this.sounds[key] = this.scene.sound.play(key, { loop: true, volume: 0.01 });
    }

    // the pause is broken this.sounds[key].pause is not a function
    pause(key: string) {
        this.sounds[key].pause();
    }

    stop(key: string) {
        this.scene.sound.stopByKey(key);
    }
}
