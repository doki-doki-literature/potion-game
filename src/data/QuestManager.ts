import { DataManager } from "./DataManager";
import { Quest } from "../objects/Quest";
import { SaveManager } from "./SaveManager";
import * as Phaser from "phaser";

export class QuestManager extends DataManager {
    activeQuestIds: Array<number>;
    quests: Array<Quest>;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.quests = [];
        this.activeQuestIds = [];
    }

    loadQuests() {
        const data = super.loadJSON("quests", "src/data/quest.json");
    }

    processData() {
        const questData = super.getJSON('quests');

        if (questData) {
            this.quests = questData.map((data: any) => new Quest(data));
        } else {
            console.error('Failed to load quest data.');
        }
    }

    addActiveQuest(questId: number) {
        let activeQuests = SaveManager.loadActiveQuests();
        activeQuests.push(questId);
        SaveManager.saveActiveQuests(activeQuests);
        this.activeQuestIds = activeQuests;
    }

    processActiveQuests() {
        let activeQuestLength = SaveManager.loadActiveQuests().length;
        let inactiveQuests = this.quests.filter((quest) => !SaveManager.loadActiveQuests().includes(quest.questId));
        for (let i = 1; i <= 3 - activeQuestLength; i++) {
            let randomQuest = inactiveQuests.splice(Math.floor((Math.random() * inactiveQuests.length)), 1)[0];
            this.addActiveQuest(randomQuest.questId);
        }
    }
}