import { DataManager } from "./DataManager";
import { Potion } from "../objects/Potion";
import { Ingredient } from "../objects/Ingredient";

export class PotionManager extends DataManager {
    potions: Potion[] = [];
    ingredients: Ingredient[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.potions = [];
        this.ingredients = [];
    }

    loadPotions(filePath: string) {
        super.loadJSON('potions', filePath);
    }

    loadIngredients(filePath: string) {
        super.loadJSON('ingredients', filePath);
    }

    processData() {
        const potionsData = super.getJSON('potions');
        const ingredientsData = super.getJSON('ingredients');

        console.log('Potions data:', potionsData);
        console.log('Ingredients data:', ingredientsData);

        if (potionsData && ingredientsData) {
            this.potions = potionsData.map((data: any) => new Potion(data));
            this.ingredients = ingredientsData.map((data: any) => new Ingredient(data));
        } else {
            console.error('Failed to load potion or ingredient data.');
        }
    }
}