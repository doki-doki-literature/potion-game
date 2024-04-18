export class QuestRating {
    questId: number;
    potionId: number;
    rating: number;
    date: Date;
    story: string;
    reward: string;

    constructor(data: any) {
        this.questId = data.questId;
        this.potionId = data.potionId;
        this.rating = data.rating;
        this.date = data.date;
        this.story = data.story;
    }
}