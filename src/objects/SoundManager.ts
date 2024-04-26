import * as Phaser from "phaser";

export class SoundManager {
    private scene: Phaser.Scene;
    sounds: any = {};

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
        this.scene.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3');
        this.scene.load.audio('crystalBall', 'assets/sound/crystalBall.mp3');
        this.scene.load.audio('dragIngredient', 'assets/sound/dragIngredientToCauldron.mp3');
        this.scene.load.audio('dragPotion', 'assets/sound/dragPotionInInventory.mp3');
        this.scene.load.audio('failedQuest', 'assets/sound/failedQuest.mp3');
        this.scene.load.audio('potionCreation', 'assets/sound/potionCreation.mp3');
        this.scene.load.audio('purchaseIngredient', 'assets/sound/purchaseIngredient.mp3');
        this.scene.load.audio('successfulPotion', 'assets/sound/successfulPotion.mp3');
        this.scene.load.audio('switchScene', 'assets/sound/switchScene.mp3');
    }

    create(key: string) {
        this.sounds[key] = this.scene.sound.add(key);
    }

    play(key: string) {
        this.sounds[key] = this.scene.sound.play(key, { loop: true, volume: 0.01 });
    }

    playLoudSFX(key: string) {
        this.sounds[key] = this.scene.sound.play(key, { loop: false, volume: 0.2 });
    }

    playSoftSFX(key: string) {
        this.sounds[key] = this.scene.sound.play(key, { loop: false, volume: 2 });
    }
    // the pause is broken this.sounds[key].pause is not a function
    pause(key: string) {
        this.sounds[key].pause();
    }

    stop(key: string) {
        this.scene.sound.stopByKey(key);
    }
}
