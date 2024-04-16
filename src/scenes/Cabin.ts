import * as Phaser from "phaser";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Cabin",
};

export class CabinScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('cabin', 'assets/image/drawings/cabin-draft.png');
        this.load.image('cauldron', 'assets/image/drawings/cauldron.png');
        this.load.image('book', 'assets/image/drawings/book.png');
        this.load.image('crystalBall', 'assets/image/drawings/crystal-ball.png');
        this.load.image('questBoard', 'assets/image/drawings/questboard.png');
    }

    create() {
        const cabinImage = this.add.image(400, 300, 'cabin').setScale(0.7, .84);

        const crystalBallImage = this.add.image(700, 150, 'crystalBall').setScale(0.7,0.7).setInteractive();
        // crystalBallImage.on("pointerdown", () => this.scene.start("Gossip"));

        const questBoardImage = this.add.image(350, 100, 'questBoard').setScale(0.7, 0.7).setInteractive();
        // questBoardImage.on("pointerdown", () => this.scene.start("QuestBillboard"));

        const cauldronImage = this.add.image(700, 425, 'cauldron').setScale(.65, .65).setInteractive();
        cauldronImage.on("pointerdown", () => this.scene.start("Craft"));

        const bookImage = this.add.image(325, 275, "book").setScale(.8, .8).setInteractive();
        bookImage.on("pointerdown", () => this.scene.start("Archive"));
    }
}