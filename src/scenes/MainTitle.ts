import * as Phaser from "phaser";
import { SoundManager } from "../objects/SoundManager";
import { SaveManager } from "../data/SaveManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Title"
};

export class MainTitleScene extends Phaser.Scene {
    soundManager: SoundManager;

    constructor() {
        super(sceneConfig);
    }
    preload() {
        this.load.audio('backgroundMusic', 'assets/sound/backgroundMusic.mp3')

        this.load.image('soundMuteButton', 'assets/image/ui-assets/volume_muted_button.png')
        this.load.image('soundUnmuteButton', 'assets/image/ui-assets/volume_unmuted_button.png')

        // construct instance of sound manager
        this.soundManager = new SoundManager(this);
        this.soundManager.preload();
        // load potion images
        for (let i = 1; i < 21; i++) {
            this.load.image(`potion${i}`, `assets/image/drawings/potions/item_${i}.png`)
        }

        // load ingredient images
        for (let i = 1; i < 11; i++) {
            this.load.image(`ingredient${i}`, `assets/image/drawings/ingredients/ingredient${i}.png`)
        }

        for (let i = 1; i < 5; i++){
            this.load.image(`questGiver${i}`, `assets/image/drawings/townspeople${i}.png`);
        }
    }

    create() {
        // background music button toggle
        this.soundManager.create('backgroundMusic');
        this.soundManager.play('backgroundMusic');
        const soundMuteButton = this.add.image(775, 25, 'soundMuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(.5);
        const soundUnmuteButton = this.add.image(775, 25, 'soundUnmuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(.5).setVisible(false);

        soundMuteButton.on("pointerdown", () => {
            this.soundManager.stop('backgroundMusic')
            soundMuteButton.setVisible(false);
            soundUnmuteButton.setVisible(true);
        });
        soundUnmuteButton.on("pointerdown", () => {
            this.soundManager.play('backgroundMusic')
            soundUnmuteButton.setVisible(false);
            soundMuteButton.setVisible(true);
        });

        if (!SaveManager.loadBeans()) {
            SaveManager.saveBeans(0);
        }

        for (let i = 1; i < 6; i++) {
            SaveManager.unlockIngredient(i);
        }

        this.add.text(450, 300, "Potion Gaem");
        const startButton = this.add.text(450, 350, "Start").setInteractive();
        startButton.on("pointerdown", () => this.scene.start("Cabin"));

        const tutorialButton = this.add.text(450, 400, "Tutorial").setInteractive();
        tutorialButton.on("pointerdown", () => this.scene.start("Tutorial"));
    }
}