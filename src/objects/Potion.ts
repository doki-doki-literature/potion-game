export class Potion {
    name: string;
    potionId: number;
    effectId: number;
    description: string;

    constructor(name: string, potionId: number, effectId: number, description: string) {
        this.name = name;
        this.description = description;
        this.potionId = potionId;
        this.effectId = effectId;
    }
}