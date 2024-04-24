import * as Phaser from "phaser";
import { SoundManager } from "../objects/SoundManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Title",
};

export class MainTitleScene extends Phaser.Scene {
    soundManager: SoundManager;

    constructor() {
        super(sceneConfig);
    }
    preload() {
        this.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3')

        this.load.image('soundMuteButton', 'assets/image/frogplaceholder.png')

        // construct instance of sound manager
        this.soundManager = new SoundManager(this);
        this.soundManager.preload();
    }

    create() {
        //sound
        this.soundManager.create('backgroundMusic');
        this.soundManager.play('backgroundMusic');
        const soundMuteButton = this.add.image(600, 50, 'soundMuteButton').setScale(.05, .05).setInteractive().setDepth(1);
        soundMuteButton.on("pointerdown", () => this.soundManager.stop('backgroundMusic'));

        this.add.text(450, 300, "Potion Gaem");
        const startButton = this.add.text(450, 350, "Start").setInteractive();
        startButton.on("pointerdown", () => this.scene.start("Cabin"));
    }
}