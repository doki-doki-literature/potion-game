import { Potion } from "../objects/Potion";

export class SaveManager {
    static saveInventory(inventory: Potion[]): void {
        const serializedInventory = JSON.stringify(inventory);

        localStorage.setItem('inventory', serializedInventory);
    }

    static loadInventory(): Potion[] {
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
        const serializedPotionLog = localStorage.getItem('discoveredPotions');
        
        if (serializedPotionLog) {
            return JSON.parse(serializedPotionLog);
        } else {
            return [];
        }
    }
}