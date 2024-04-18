import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Inventory",
};

export class InventoryScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        SceneUtils.loadUi(this);
    }

    create() {
        SceneUtils.addNavigation(this);

        this.add.text(400, 300, "Inventory").setScale(.08, .08).setDepth(-1);
    }
}