import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { PotionManager } from "../data/PotionManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "QuestArchiveView",
};

export class QuestArchiveViewScene extends Phaser.Scene {
    questManager: QuestManager;
    potionManager: PotionManager;
    selectedPotionImage: Phaser.GameObjects.Image;
    stars: Array<Phaser.GameObjects.Image> = [];
    ingredients: Array<Phaser.GameObjects.Image> = [];

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image("bookBackground", "assets/image/ui-assets/archive_display.png");
        this.load.image("questHistoryButton", "assets/image/ui-assets/archive_horizontal_button.png");
        SceneUtils.loadUi(this);
        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
        for (let i = 1; i < 4; i++) {
            this.load.image(`questGiver${i}`, `assets/image/drawings/townspeople${i}.png`);
        }
        for (let i = 1; i < 21; i++) {
            this.load.image(`potion${i}`, `assets/image/drawings/potions/item_${i}.png`)
        }
        this.load.bitmapFont('handwritten', 'assets/fonts/Fool_0.png', 'assets/fonts/Fool.fnt');

        this.potionManager = new PotionManager(this);
        this.potionManager.loadPotions();
        this.potionManager.loadIngredients();

        for (let i = 1; i < 11; i++) {
            this.load.image(`ingredient${i}`, `assets/image/drawings/ingredients/ingredient${i}.png`);
        }
    }

    create() {
        this.questManager.processData();
        this.potionManager.processData();

        const questProgress = SaveManager.loadQuestProgress();

        // Create a back button
        SceneUtils.addNavigation(this);
        this.add.image(400, 350, "bookBackground").setScale(.8, .8).setDepth(-1);

        const originalQuestText = this.add.text(420, 150, "", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '12px',
            color: '#000000',
            align: 'center'
        }).setWordWrapWidth(280).setDepth(4).setOrigin(0, 0);

        const submittedPotionText = this.add.text(450, 270, "", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '12px',
            color: '#000000',
            align: 'center'
        }).setWordWrapWidth(280).setDepth(4).setOrigin(0, 0);

        const selectedQuestText = this.add.text(420, 300, "", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '12px',
            color: '#000000',
            align: 'center'
        }).setWordWrapWidth(280).setDepth(4).setOrigin(0, 0);

        const recipeUnlockedText = this.add.text(420, 475, "", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '8px',
            color: '#000000',
        }).setDepth(4).setOrigin(0, 0);

        const dateText = this.add.text(600, 130, "", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '8px',
            color: '#000000',
        }).setDepth(4).setOrigin(0, 0);

        // Set the size of the container
        var containerWidth = 400; // Width of the container
        var containerHeight = 300; // Height of the container

        // Create a scrollable container
        var questScrollableContainer = this.add.container(245, 245);

        this.add.text(170, 150, "Quest Log", {
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: '32px',
            color: '#000000'
        });

        // Add a mask to the container
        var questMaskGraphics = this.make.graphics();
        questMaskGraphics.fillRect(0, 200, containerWidth, containerHeight);
        var questMask = new Phaser.Display.Masks.GeometryMask(this, questMaskGraphics);

        var storyMaskGraphics = this.make.graphics();
        storyMaskGraphics.fillRect(420, 100, 400, 500);
        var storyMask = new Phaser.Display.Masks.GeometryMask(this, storyMaskGraphics);

        questScrollableContainer.setMask(questMask);

        questScrollableContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, containerWidth, 1000), (hitArea: any, x: number, y: number, gameObject: Phaser.GameObjects.GameObject) => {
            return this.game.input.mousePointer.x < 400;
        });

        // Add objects to the container
        questProgress.forEach((qp, index) => {
            const questContainer = this.add.image(0, index * 60, "questHistoryButton").setScale(1, 1.1).setInteractive();
            questScrollableContainer.add(questContainer);

            const quest = this.questManager.quests.find(q => q.questId == qp.questId);

            const questGiver = quest.questGiver;
            const questText = this.add.text(30, index * 60, questGiver, {
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontSize: '14px',
                color: '#000000'
            }).setOrigin(.5, .5);
            questScrollableContainer.add(questText);

            const potion = this.potionManager.potions.find(p => p.potionId == qp.potionId);
            const potionImage = this.add.image(-70, index * 60, `potion${potion.potionId}`).setScale(.015, .015);
            questScrollableContainer.add(potionImage);

            const questGiverImage = this.add.image(-100, index * 60, `questGiver${quest.questGiverId}`).setScale(.06, .06);
            questScrollableContainer.add(questGiverImage);

            questContainer.on("pointerdown", () => {
                this.stars.forEach(star => star.destroy());
                this.stars = [];
                this.ingredients.forEach(ingredient => ingredient.destroy());
                this.ingredients = [];
                this.selectedPotionImage?.destroy();
                selectedQuestText.setText(qp.story);
                submittedPotionText.setText(`You submitted: ${SaveManager.loadPotionLog().includes(potion.potionId) ? potion.name : "???"}`);
                originalQuestText.setText(`${questGiver}: "${quest.content}"`);
                dateText.setText(qp.date.toString());

                for (let i = 0; i < qp.rating; i++) {
                    this.stars.push(this.add.image(525 + i * 40, 500, "star").setScale(.6, .6).setDepth(-1));
                }

                if (!!qp.revealText) {
                    recipeUnlockedText.setText("Recipe Unlocked!");
                    this.ingredients.push(this.add.image(445, 510, `ingredient${potion.ingredientId1}`).setScale(.025, .025));
                    this.ingredients.push(this.add.image(475, 510, `ingredient${potion.ingredientId2}`).setScale(.025, .025));
                } else {
                    recipeUnlockedText.setText("");
                }
            });
        });

        // Enable scroll
        this.input.setDraggable(questScrollableContainer);

        questScrollableContainer.on("drag", (pointer, dragX, dragY) => {
            if (dragY > 230) {
                questScrollableContainer.setY(230);
            } else if (dragY < 230 - (questProgress.length * 47)) {
                questScrollableContainer.setY(230 - (questProgress.length * 47));
            } else {
                questScrollableContainer.setY(dragY);
            }
        });
    }
}