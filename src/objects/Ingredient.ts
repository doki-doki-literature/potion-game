export class Ingredient {
    ingredientId: number;
    name: string;
    imageUrl: string;
    description: string;

    constructor(data: any) {
        this.ingredientId = data.ingredientId;
        this.name = data.name;
        this.imageUrl = data.imageUrl;
        this.description = data.description;
    }
}
