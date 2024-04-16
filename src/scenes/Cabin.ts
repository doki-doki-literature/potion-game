import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Cabin",
};

export class CabinScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('cauldron', 'assets/image/drawings/cauldron.png');
        this.load.image('book', 'assets/image/drawings/book.png');
    }

    create() {
        const cauldronImage = this.add.image(400, 500, 'cauldron').setScale(.5, .5).setInteractive();
        cauldronImage.on("pointerdown", () => this.scene.start("Craft"));

        const bookImage = this.add.image(300, 300, "book").setInteractive();
        bookImage.on("pointerdown", () => this.scene.start("Archive"));
    }
}