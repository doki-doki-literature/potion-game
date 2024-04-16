import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Archive",
};

export class ArchiveScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image("bookBackground", "assets/image/book_background.png");
    }

    create() {
        // Create a back button
        const backButton = this.add.text(20, 50, "Back to Cabin").setInteractive();
        backButton.on("pointerdown", () => this.scene.start("Cabin"));

        this.add.image(400, 300, "bookBackground").setScale(.08, .08).setDepth(-1);
    }
}