import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { QuestRating } from "../objects/QuestRating";
import { SceneUtils } from "../utils/SceneUtils";

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

        for(let i = 1; i <= 3; i++) {
            this.load.image(`questGiver${i}`, `assets/image/drawings/townspeople${i}.png`);
        }

        this.load.bitmapFont('handwritten', 'assets/fonts/Fool_0.png', 'assets/fonts/Fool.fnt');

        SceneUtils.loadUi(this);
        SceneUtils.loadBackground(this);
    }

    create() {
        this.questManager.processData();

        SceneUtils.addNavigation(this);
        SceneUtils.addBackground(this);

        const activeQuestIds = SaveManager.loadActiveQuests();
        activeQuestIds.forEach((questId, index) => {
            const quest = this.questManager.quests.find(quest => quest.questId == questId);
            const questImage = this.add.image(130 + index * 270, 340, 'itemDisplay').setScale(.65, .73).setDepth(-1);
            const questGiverImage = this.add.image(130 + index * 270, 540, `questGiver${quest.questGiverId}`).setScale(.3, .3);
            const questGiverName = this.add.bitmapText(40 + index * 270, 200, 'handwritten', quest.questGiver, 22, 1).setMaxWidth(150);
            const questText = this.add.bitmapText(30 + index * 270, 250, 'handwritten', quest.content, 14, 1).setMaxWidth(200);

            questImage.setInteractive().on("pointerdown", () => this.scene.start("QuestGiver", { questId : quest.questId }))
        })
    }
}