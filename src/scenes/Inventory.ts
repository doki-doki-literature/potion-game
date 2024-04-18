import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Inventory",
};

export class MainTitleScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    create() {
        this.add.text(450, 300, "Inventory");
    }
}