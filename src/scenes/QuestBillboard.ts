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
    activeQuestIds: Array<number>;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
        this.questProgress = SaveManager.loadQuestProgress();
        this.activeQuestIds = SaveManager.loadActiveQuests();

        console.log(this.activeQuestIds);
    }

    create() {
        this.questManager.processData();
        this.processQuestProgress();

        // Create a back button
        const backButton = this.add.text(20, 50, "Back to Cabin").setInteractive();
        backButton.on("pointerdown", () => {
            return this.scene.start("Cabin");
        });
    }

    addActiveQuest(questId: number) {
        let activeQuests = SaveManager.loadActiveQuests();
        activeQuests.push(questId);
        SaveManager.saveActiveQuests(activeQuests);
        this.activeQuestIds = activeQuests;
    }

    processQuestProgress() {
        let activeQuestLength = this.activeQuestIds.length
        let inactiveQuests = this.questManager.quests.filter((quest) => !this.activeQuestIds.includes(quest.questId));
        for (let i = 1; i <= 3 - activeQuestLength; i++) {
            let randomQuest = inactiveQuests.splice(Math.floor((Math.random() * inactiveQuests.length)), 1)[0];
            this.addActiveQuest(randomQuest.questId);
        }
    }
}