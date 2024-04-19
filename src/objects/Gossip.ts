export class Gossip {
    gossipId: number;
    content: string;
    ingredientId: number;
    potionId: number;

    constructor(data: any) {
        this.gossipId = data.gossipId;
        this.content = data.content;
        this.ingredientId = data.ingredientId;
        this.potionId = data.potionId;
    }
}
