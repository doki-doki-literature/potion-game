import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Title",
};

export class MainTitleScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    create() {
        this.add.text(450, 300, "Potion Gaem");
        const startButton = this.add.text(450, 350, "Start").setInteractive();
        startButton.on("pointerdown", () => this.scene.start("Cabin"));
    }
}