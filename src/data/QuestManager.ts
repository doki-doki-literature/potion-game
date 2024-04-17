import { DataManager } from "./DataManager";
import { Quest } from "../objects/Quest";
import * as Phaser from "phaser";

export class QuestManager extends DataManager {
    activeQuestIds: Array<number>;
    quests: Array<Quest>;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.quests = [];
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
}