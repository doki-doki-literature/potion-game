import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { QuestRating } from "../objects/QuestRating";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "QuestFinish",
};

export class QuestFinish extends Phaser.Scene {
    questManager: QuestManager;
    result: Array<QuestRating>;
    private storyText: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.result = SaveManager.loadQuestProgress();
        SceneUtils.loadUi(this);
        this.load.image("bookBackground", "assets/image/ui-assets/archive_display.png");
    }

    create() {
        SceneUtils.addNavigation(this);
        this.add.image(400, 350, "bookBackground").setScale(.8, .8).setDepth(-1);

        //getting the last object of the quest array in local storage
        let lastResult = this.result[this.result.length-1];

        //creating an object to display the story text
        this.storyText = this.add.text(25, 300, '', { color: '#000000' });
        this.storyText.setDepth(3);
        this.storyText.setWordWrapWidth(580);
        this.storyText.setText(lastResult.story)
    }
}