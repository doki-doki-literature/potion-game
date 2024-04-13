import { Ingredient } from "./Ingredient";

export class Recipe {
    id: number;
    ingredients: Array<Ingredient>;
    potionId: number;
    imageUrl: string;

    constructor(id: number, ingredients: Array<Ingredient>, potionId: number, imageUrl: string) {
        this.id = id;
        this.ingredients = ingredients;
        this.potionId = potionId;
        this.imageUrl = imageUrl;
    }
}