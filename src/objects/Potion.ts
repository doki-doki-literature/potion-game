export class Potion {
    name: string;
    potionId: number;
    effectDescription: string;
    description: string;
    ingredientId1: number;
    ingredientId2: number;
    effectText: string;

    constructor(data: any) {
        this.name = data.name;
        this.potionId = data.potionId;
        this.effectDescription = data.effectDescription;
        this.description = data.description;
        this.ingredientId1 = data.ingredientId1;
        this.ingredientId2 = data.ingredientId2;
        this.effectText = data.effectText;
    }
}
