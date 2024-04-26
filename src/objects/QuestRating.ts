export class QuestRating {
    questId: number;
    potionId: number;
    rating: number;
    date: Date;
    story: string;
    revealText: string;
    newPotion: boolean;
    reward: boolean;
    rewardItem: string;
    rewardText: string;

    constructor(data: any) {
        this.questId = data.questId;
        this.potionId = data.potionId;
        this.rating = data.rating;
        this.date = data.date;
        this.story = data.story;
        this.revealText = data.revealText;
        this.newPotion = data.newPotion;
        this.reward = data.reward;
        this.rewardItem = data.rewardItem;
        this.rewardText = data.rewardText;
    }
}