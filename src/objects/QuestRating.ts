export class QuestRating {
    questId: number;
    potionId: number;
    rating: number;
    date: Date;
    story: string;
    reward: string;
    revealText: string;
    newPotion: boolean;

    constructor(data: any) {
        this.questId = data.questId;
        this.potionId = data.potionId;
        this.rating = data.rating;
        this.date = data.date;
        this.story = data.story;
        this.reward = data.reward;
        this.revealText = data.revealText;
        this.newPotion = data.newPotion;
    }
}