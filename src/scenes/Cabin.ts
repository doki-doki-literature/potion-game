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
        this.load.image('cabin', 'assets/image/drawings/cabin-draft.png');
        this.load.image('cauldron', 'assets/image/drawings/cauldron.png');
        this.load.image('book', 'assets/image/drawings/book.png');
    }

    create() {
        const cabinImage = this.add.image(400, 300, 'cabin').setScale(0.7, .84);
        const cauldronImage = this.add.image(700, 425, 'cauldron').setScale(.65, .65).setInteractive();
        cauldronImage.on("pointerdown", () => this.scene.start("Craft"));

        const bookImage = this.add.image(325, 275, "book").setScale(.8, .8).setInteractive();
        bookImage.on("pointerdown", () => this.scene.start("Archive"));
    }
}