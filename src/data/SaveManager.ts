import { PotionQuantity } from "../objects/PotionQuantity";
import { QuestRating } from "../objects/QuestRating";

export class SaveManager {
    static saveInventory(inventory: Array<PotionQuantity>): void {
        const serializedInventory = JSON.stringify(inventory);

        localStorage.setItem('inventory', serializedInventory);
    }

    static loadInventory(): Array<PotionQuantity> {
        const serializedInventory = localStorage.getItem('inventory');

        if (serializedInventory) {
            return JSON.parse(serializedInventory);
        } else {
            return [];
        }
    }

    static savePotionLog(potionLog: number[]): void {
        const serializedPotionLog = JSON.stringify(potionLog);

        localStorage.setItem('discoveredPotions', serializedPotionLog);
    }

    static loadPotionLog(): number[] {
        const serializedPotionLog = localStorage.getItem('discoveredPotions')

        if (serializedPotionLog) {
            return JSON.parse(serializedPotionLog);
        } else {
            return [];
        }
    }

    static loadQuestProgress(): Array<QuestRating> {
        const serializedQuests = localStorage.getItem('questProgress');

        if (serializedQuests) {
            return JSON.parse(serializedQuests);
        } else {
            return [];
        }
    }

    static saveProgress(questProgress: Array<QuestRating>) {
        const serializedQuests = JSON.stringify(questProgress);

        localStorage.setItem('questProgress', serializedQuests);
    }

    static saveActiveQuests(activeQuests: Array<number>) {
        const serializedActiveQuests = JSON.stringify(activeQuests);

        localStorage.setItem('activeQuests', serializedActiveQuests);
    }

    static loadActiveQuests(): Array<number> {
        const serializedActiveQuests = localStorage.getItem('activeQuests');

        if (serializedActiveQuests) {
            return JSON.parse(serializedActiveQuests);
        } else {
            return [];
        }
    }
}