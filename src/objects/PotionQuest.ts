export class PotionQuest {
    questId: string;
    potionId: number;
    story: string;
    rating: number;
    reveal: boolean;
    revealText: string;

    constructor(data: any)
    {
        this.potionId = data.potionId;
        this.story = data.story;
        this.rating = data.rating;
        this.reveal = data.reveal;
        this.revealText = data.revealText;
    }
}