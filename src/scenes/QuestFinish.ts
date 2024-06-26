import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { QuestRating } from "../objects/QuestRating";
import { PotionManager } from "../data/PotionManager";
import { SoundManager } from "../objects/SoundManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "QuestFinish"
};

export class QuestFinish extends Phaser.Scene {
    questManager: QuestManager;
    result: Array<QuestRating>;
    lastResult: any;
    discoveredPotions: number[];
    potionDescriptionText: Phaser.GameObjects.Text;
    potionsContainer: Phaser.GameObjects.Container;
    soundManager: SoundManager;
    private potionManager: PotionManager;
    private storyText: Phaser.GameObjects.Text;
    private potionText: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        // load quest rating object from local storage
        this.result = SaveManager.loadQuestProgress();

        // load sound manager
        this.soundManager = new SoundManager(this);
        this.soundManager.preload();

        //getting the last object of the quest rating array
        this.lastResult = this.result[this.result.length - 1];

        // load potions array from local storage
        this.discoveredPotions = SaveManager.loadPotionLog();

        // load the potion manager so we can get the name of the potion from potionId
        this.potionManager = new PotionManager(this);
        this.potionManager.loadPotions();

        SceneUtils.loadUi(this);

        this.load.image("scroll", "assets/image/ui-assets/inventory_item_display.png");

        // load potion images
        for (let i = 1; i < 21; i++) {
            this.load.image(`potion${i}`, `assets/image/drawings/potions/item_${i}.png`)
        }

        // load reward images
        this.load.image('boot', 'assets/image/drawings/rewards/boot.png');
        this.load.image('deerHead', 'assets/image/drawings/rewards/deer-head.png');
        this.load.image('dragonScale', 'assets/image/drawings/rewards/dragon-scale.png');
        this.load.image('rose', 'assets/image/drawings/rewards/rose.png');
    }

    create() {
        SceneUtils.addNavigation(this);

        //failed quest sound
        if (this.lastResult.rating === 1) {
            this.soundManager.playSoftSFX('failedQuest');
        }

        this.add.image(240, 350, "scroll").setScale(.8, .8).setDepth(-1);
        this.add.image(400, 150, 'selectedIngredients').setDepth(-1).setOrigin(0, 0).setScale(.7, .7);

        // adding an overlay for if the player receives a reward item
        if (this.lastResult.reward) {
            const rewardText = this.add.text(this.cameras.main.width / 2, 350, this.lastResult.rewardText, { color: '#ffffff' });

            rewardText.setOrigin(0.5);
            rewardText.setInteractive();
            rewardText.setDepth(4);
            rewardText.setWordWrapWidth(500);

            const rewardImage = this.add.image(this.cameras.main.width / 2, 225, this.lastResult.rewardItem);
            rewardImage.setOrigin(0.5);
            rewardImage.setDepth(4);
            rewardImage.setScale(.1);

            console.log(this.lastResult.rewardText);
            console.log(this.lastResult.rewardItem);
            console.log(rewardImage);
            const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
            overlay.setOrigin(0);
            overlay.setInteractive();
            overlay.setDepth(3);
            overlay.on("pointerdown", () => {
                overlay.destroy();
                rewardText.destroy();
                rewardImage.destroy();
            });
        }

        // creating an object to display the story text
        this.add.text(180, 190, "Quest Report:").setColor('#000000')
        this.storyText = this.add.text(130, 220, '', { color: '#000000' });
        this.storyText.setDepth(3);
        this.storyText.setFontSize(12);
        this.storyText.setWordWrapWidth(240);
        this.storyText.setText(this.lastResult.story)

        // text for new potion discovered
        if (this.lastResult.newPotion){
            this.add.text(480, 130, "New Potion Discovered!").setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        }

        // potion section
        this.potionManager.processData();

        // displaying the potion picture
        this.add.image(490, 235, "inventoryTile").setScale(.75, .75).setDepth(1);
        let potionImage = this.add.image(490, 235, `potion${this.lastResult.potionId}`).setScale(.03, .03).setDepth(2).setInteractive();

        // hover to display potion description is currently not working
        // Create a text object to display potion description
        this.potionDescriptionText = this.add.text(0, 0, '', { color: '#ffffff', backgroundColor: '#000000' });
        this.potionDescriptionText.setDepth(1); // Ensure the text is above other elements
        this.potionDescriptionText.setWordWrapWidth(400);
        this.potionDescriptionText.setVisible(false); // Initially hide the text

        // Set pointer out event to hide potion description text
        this.input.on('pointerout', () => {
            // Hide the text when the cursor moves away from the potion
            this.potionDescriptionText.setVisible(false);
        });
        // Set pointer over event for potions
        potionImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            const potionId = this.lastResult.potionId;
            const potion = this.potionManager.potions.find((p) => p.potionId==this.lastResult.potionId);
            if (potion && this.discoveredPotions.includes(potionId)) {
                // Set text position to match cursor
                this.potionDescriptionText.setPosition(pointer.x - 150, pointer.y + 30);
                // Set text content to ingredient description
                this.potionDescriptionText.setText(potion.name + ": " + potion.description);
                // Show the text
                this.potionDescriptionText.setVisible(true);
            } else {
                this.potionDescriptionText.setPosition(pointer.x - 20, pointer.y + 30);
                this.potionDescriptionText.setText("???");
                this.potionDescriptionText.setVisible(true);
            }
        });

        // displaying the potion text
        this.add.text(550, 200, "Submitted Potion:");

        const potionText = this.potionManager.potions.find((p) => p.potionId==this.lastResult.potionId).name;

        this.potionText = this.add.text(550, 240, '', { color: '#ffffff' });
        this.potionText.setDepth(2);
        this.potionText.setWordWrapWidth(160);
        if (this.discoveredPotions.includes(this.lastResult.potionId)) {
            this.potionText.setText(potionText)
        } else {
            this.potionText.setText("???")
        }

        // displaying rating
        this.add.text(460, 340, "Rating:");
        for (let i = 0; i < this.lastResult.rating; i++) {
            this.add.image(580 + i * 40, 350, "star").setScale(.75, .75).setDepth(-1);
        }

        // // displaying success or failure
        // if (this.lastResult.rating == 1) {
        //     this.add.text(540, 410, "Failure :(")
        // }
        // if (this.lastResult.rating == 2) {
        //     this.add.text(540, 410, "Meh.")
        // }
        // if (this.lastResult.rating == 3) {
        //     this.add.text(540, 410, "Success!")
        // }

        // displaying bean
        this.add.text(460, 400, 'Earned:');
        this.add.image(580, 410, 'bean').setScale(.03, .03);
        this.add.text(610, 400, `x${this.lastResult.rating * 10}`);

        // displaying reveal text
        if (this.lastResult.revealText) {
            this.add.text (450, 450, `Notes: ${this.lastResult.revealText}`).setWordWrapWidth(300);
        }
    }
}
