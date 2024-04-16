import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Quest",
};

export class QuestBillboardScene extends Phaser.Scene {
    questManager: QuestManager;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
    }

    create() {
        this.questManager.processData();

        console.log(this.questManager.quests);
    }
}