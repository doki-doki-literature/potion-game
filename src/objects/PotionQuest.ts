export class PotionQuest {
    potionId: number;
    story: string;
    rating: number;

    constructor(data: any)
    {
        this.potionId = data.potionId;
        this.story = data.story;
        this.rating = data.rating;
    }
}