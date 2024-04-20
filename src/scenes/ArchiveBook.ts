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
        this.load.image("bookBackground", "assets/image/ui-assets/archive_display.png");
        SceneUtils.loadUi(this);
    }

    create() {
        // Create a back button
        SceneUtils.addNavigation(this);

        this.add.image(400, 350, "bookBackground").setScale(.8, .8).setDepth(-1);
        this.add.text(250, 300, "Hope you like this book.").setColor('#000000');
    }
}