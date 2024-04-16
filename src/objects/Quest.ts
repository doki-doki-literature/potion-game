import { PotionQuest } from "./PotionQuest";

export class Quest {
    questId: number;
    questGiver: string;
    content: string;
    stories: Array<PotionQuest>;
    defaultMessage: string;

    constructor(data: any)
    {
        this.questId = data.questId;
        this.questGiver = data.questGiver;
        this.content = data.content;
        this.stories = data.stories;
        this.defaultMessage = data.string;
    }
}