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

        const questButton = this.add.bitmapText(500, 200, "handwritten", "Quests").setFontSize(30).setInteractive();
        questButton.on("pointerover", () => {
            questButton.setTintFill(0xffffff);
        })

        questButton.on("pointerout", () => {
            questButton.setTintFill(0x000000);
        })

        questButton.on("pointerdown", () => {
            this.scene.start("QuestArchiveView");
        })
    }
}