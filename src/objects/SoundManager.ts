import * as Phaser from "phaser";

export class SoundManager {
    private music: Phaser.Sound.Sound;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
        this.scene.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3');
    }

    create() {
        this.music = this.scene.sound.add('backgroundMusic');
    }

    play() {
        this.music.play({ loop: true, volume: 0.5 });
    }

    pause() {
        this.music.pause();
    }

    stop() {
        this.music.stop();
    }
}
