import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { QuestRating } from "../objects/QuestRating";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Quest",
};

export class QuestBillboardScene extends Phaser.Scene {
    questManager: QuestManager;
    questProgress: Array<QuestRating>;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
        this.questProgress = SaveManager.loadQuestProgress();
    }

    create() {
        this.questManager.processData();
        this.questManager.processActiveQuests();

        // Create a back button
        const backButton = this.add.text(20, 50, "Back to Cabin").setInteractive();
        backButton.on("pointerdown", () => {
            return this.scene.start("Cabin");
        });

        this.add.text(200, 100, "Active Quests: ");
        const activeQuestIds = SaveManager.loadActiveQuests();
        activeQuestIds.forEach((questId, index) => {
            const quest = this.questManager.quests.find(quest => quest.questId == questId);
            const questText = this.add.text(200, 200 + index * 40, quest.questGiver);
            questText.setInteractive().on("pointerdown", () => this.scene.start("QuestGiver", { questId : quest.questId }))
        })
    }
}