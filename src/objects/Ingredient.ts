export class Ingredient {
    ingredientId: number;
    name: string;
    imageUrl: string;
    description: string;

    constructor(ingredientId: number, name: string, imageUrl: string, description: string) {
        this.ingredientId = ingredientId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}