export class QuestRating {
    potionId: number;
    rating: number;
    date: Date;

    constructor(data: any) {
        this.potionId = data.potionId;
        this.rating = data.rating;
        this.date = data.date;
    }
}