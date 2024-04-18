import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";

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
        SceneUtils.loadUi(this);
    }

    create() {
        // Create a back button
        SceneUtils.addNavigation(this);

        this.add.image(400, 300, "bookBackground").setScale(.08, .08).setDepth(-1);
    }
}