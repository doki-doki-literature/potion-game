import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";
import { PotionManager } from "../data/PotionManager";
import { Quest } from "../objects/Quest";
import { SaveManager } from "../data/SaveManager";
import { PotionQuantity } from "../objects/PotionQuantity";
import { QuestRating } from "../objects/QuestRating";
import { SceneUtils } from "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "QuestGiver",
};

export class QuestGiver extends Phaser.Scene {
    questManager: QuestManager;
    potionManager: PotionManager;
    discoveredPotions: number[];
    quest: Quest;
    inventory: Array<PotionQuantity>;
    potionDescriptionText: Phaser.GameObjects.Text;
    selectedPotionId: number;
    selectedPotionImage: Phaser.GameObjects.Image;
    dropzone: Phaser.GameObjects.Zone;
    potionsContainer: Phaser.GameObjects.Container;
    private currentPage: number = 0;
    private potionsPerPage: number = 15;
    private totalPages: number;

    constructor() {
        super(sceneConfig);
    }

    init(data: any) {
        const questId = data.questId;

        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
        this.questManager.processData();

        this.quest = this.questManager.quests.find((quest) => quest.questId == questId)!;
    }

    preload() {
        this.inventory = SaveManager.loadInventory();

        // Load the background image asset
        this.load.image('background', 'assets/image/drawings/cabin-draft.png');
        for (let i = 1; i < 21; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }

        for (let i = 1; i < 5; i++){
            this.load.image(`questGiver${i}`, `assets/image/drawings/townspeople${i}.png`);
        }
        for (let i = 1; i < 31; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }

        this.load.image(`questGiver${this.quest.questGiverId}`, `assets/image/drawings/townspeople${this.quest.questGiverId}.png`);

        this.potionManager = new PotionManager(this);
        this.potionManager.loadPotions();
        this.potionManager.loadIngredients();

        // load potions array from local storage
        this.discoveredPotions = SaveManager.loadPotionLog();

        this.potionsContainer = this.add.container(0, 0).setName('potions');
        SceneUtils.loadUi(this);
        SceneUtils.loadBackground(this);
    }

    create() {
        this.potionManager.processData();

        SceneUtils.addNavigation(this);
        SceneUtils.addBackground(this);
        SceneUtils.addItemSelectContainer(this);
        SceneUtils.addBeanCounter(this);

        this.add.image(650, 475, `questGiver${this.quest.questGiverId}`).setScale(.3, .3).setDepth(-1);

        // Add the background image to the scene
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0);

        // Set the background image to cover the entire game canvas
        backgroundImage.setDepth(-3);
        backgroundImage.setAlpha(.2);
        backgroundImage.displayWidth = this.game.canvas.width;
        backgroundImage.displayHeight = this.game.canvas.height;

        //Add quest text
        this.add.text(50, 125, `Quest: ${this.quest.content}`).setWordWrapWidth(700).setFontSize(14)

        // Process loaded data
        let potionsData = this.potionManager.potions;

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

        let resultText = this.add.text(20, 320, '', { color: '#ffffff' });
        let visualDescriptionText = this.add.text(20, 350, '', { color: '#ffffff' });

        // some instruction
        this.add.text(570, 190, 'Give this potion?');

        // Create a container for the submission box
        this.add.image(650, 250, 'inventoryTile').setScale(.55, .55);

        // Create a drop zone for the submission box
        this.dropzone = this.add.zone(650, 250, 100, 100);
        this.dropzone.setDropZone();

        // Calculate total pages
        this.totalPages = Math.ceil(potionsData.length / this.potionsPerPage);

        // Create pagination buttons
        const prevButton = this.add.text(100, 500, 'Prev', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
            this.currentPage = Phaser.Math.Clamp(this.currentPage - 1, 0, this.totalPages - 1);
            this.updatePage(potionsData);
        });

        const nextButton = this.add.text(400, 500, 'Next', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
            this.currentPage = Phaser.Math.Clamp(this.currentPage + 1, 0, this.totalPages - 1);
            this.updatePage(potionsData);
        });

        // Initialize current page
        this.updatePage(potionsData);

        // Set drag event for potions
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.children.bringToTop(gameObject); // Bring the dragged object to the top
        });

        // Create submit button
        const submitButton = this.add.image(600, 320, 'button').setScale(.45, .5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.completeQuest();
                this.handleSubmit();
                this.updatePage(potionsData);
            });
        SceneUtils.addButtonHover(this, submitButton, 600, 320, 0, .45, .5);

        const submitButtonText = this.add.text(submitButton.x - 25, submitButton.y - 10, "Submit");

        const clearButton = this.add.image(700, 320, 'button').setScale(.45, .5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (this.selectedPotionId == null) {
                    return;
                }
                const previousQuantityText = this.potionsContainer.list.find((go: Phaser.GameObjects.GameObject) => go.data?.get("potionQuantityId") == this.selectedPotionId && go instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text;
                this.inventory.find(q => q.potionId == this.selectedPotionId).quantity += 1;
                previousQuantityText?.setText(`x${this.inventory.find((q) => q.potionId == this.selectedPotionId).quantity}`);
                this.selectedPotionId = null;
                this.selectedPotionImage?.destroy();
            })
        SceneUtils.addButtonHover(this, clearButton, 700, 320, 0, .45, .5);
        const clearButtonText = this.add.text(clearButton.x - 25, clearButton.y - 10, "Clear");
    }

    handleSubmit() {
        if (this.selectedPotionId) {
            const potionId = this.selectedPotionId;

            if (true) {
                // Add white text on top of the overlay

                //Temporarily removed potion discovery to check potion names
                const text1 = this.add.text(this.cameras.main.width / 2, 300, "Thanks!", { color: '#ffffff' });
                // const text1 = this.add.text(this.cameras.main.width / 2, 300, "You have crafted: " +  name, { color: '#ffffff' });

                text1.setOrigin(0.5);
                text1.setInteractive();
                text1.setDepth(4);
                text1.setWordWrapWidth(300);

                // Create a grey transparent rectangle covering the entire screen
                const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
                overlay.setOrigin(0);
                overlay.setInteractive();
                overlay.setDepth(3);
                overlay.on("pointerdown", () => {
                    overlay.destroy();
                    text1.destroy();
                    this.selectedPotionImage?.destroy();
                });
            }

            // Clear selected ingredients
            this.selectedPotionId = null;
            this.scene.start("QuestFinish", { questId : this.quest.questId });
        } else {
            console.log('Please select a potion.');
        }
    }

    completeQuest() {
        let currentProgress = SaveManager.loadQuestProgress();
        let story = this.quest.stories.find(s => s.potionId == this.selectedPotionId);
        let currentPotionLog = SaveManager.loadPotionLog();

        if (story) {
            const result = new QuestRating({
                questId: this.quest.questId,
                story: story.story,
                rating: story.rating,
                reveal: story.reveal,
                date: new Date(),
                potionId: this.selectedPotionId,
                revealText: story.revealText,
                newPotion: !currentPotionLog.includes(story.potionId) && story.reveal
            });
            currentProgress.push(result);
            SaveManager.saveProgress(currentProgress);

            if (story.reveal && !currentPotionLog.includes(story.potionId)) {
                currentPotionLog.push(story.potionId);
                SaveManager.savePotionLog(currentPotionLog);
            }
        } else {
            const result = new QuestRating({
                questId: this.quest.questId,
                story: this.quest.defaultMessage,
                rating: 1,
                reveal: false,
                date: new Date(),
                potionId: this.selectedPotionId
            });
            currentProgress.push(result);
            SaveManager.saveProgress(currentProgress);
        }
        SaveManager.awardBeans(story.rating * 10);
        SaveManager.saveInventory(this.inventory);
        let activeQuests = SaveManager.loadActiveQuests();
        activeQuests = activeQuests.filter(questId => questId != this.quest.questId);
        SaveManager.saveActiveQuests(activeQuests);
        this.questManager.processActiveQuests();
    }

    updatePage(potionsData: any[]) {
        // Clear existing potions
        this.potionsContainer.destroy();

        // Create a new container for potions on the current page
        this.potionsContainer = this.add.container(0, 0).setName('potions');
        const startX = -10;
        const spacingX = 90;
        const spacingY = 90;
        const startY = 160;

        // Calculate start and end index for current page
        const startIndex = this.currentPage * this.potionsPerPage;
        const endIndex = Math.min(startIndex + this.potionsPerPage, potionsData.length);
        let row = 1;
        let column = 1;
        // Display potions for the current page
        for (let index = startIndex; index < endIndex; index++) {
            //bug fix - potions not displaying when currentPage = 1
            const pq = this.inventory.slice(startIndex, endIndex)[index - startIndex];
            if (index < startIndex) {
                return;
            }

            if (index >= endIndex) {
                return;
            }

            let originalX = startX + column * spacingX;
            let originalY = startY + row * spacingY;
            const potionContainer = this.add.image(originalX, originalY, 'inventoryTile').setDepth(-1).setScale(.6, .6);
            if (!!pq) {
                let potionImage = this.add.image(originalX, originalY, `potion${pq.potionId}`).setScale(2, 2);
                let quantityText = this.add.text(originalX + 12, originalY + 15, `x${pq.quantity}`).setData("potionQuantityId", pq.potionId).setColor("#000000");
                this.potionsContainer.add(quantityText);
                potionImage.setData('potionId', pq.potionId);
                potionImage.setInteractive();
                if (pq.quantity > 0) {
                    this.input.setDraggable(potionImage);
                }

                // Set drag event
                potionImage.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                    potionImage.setX(pointer.x);
                    potionImage.setY(pointer.y);
                });

                potionImage.on('dragend', (pointer: Phaser.Input.Pointer) => {
                    potionImage.setX(originalX);
                    potionImage.setY(originalY);
                });

                potionImage.on('pointerup', () => {
                    const potionId = potionImage.getData('potionId');
                    if (this.inventory.find(q => q.potionId == potionId).quantity > 0) {
                        if (this.selectedPotionId) {
                            this.selectedPotionImage.destroy();
                            const previousQuantityText = this.potionsContainer.list.find((go: Phaser.GameObjects.GameObject) => go.data?.get("potionQuantityId") == this.selectedPotionId && go instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text;
                            this.inventory.find(q => q.potionId == this.selectedPotionId).quantity += 1;
                            previousQuantityText?.setText(`x${this.inventory.find((q) => q.potionId == this.selectedPotionId).quantity}`);
                        }
                        this.selectedPotionId = potionId;
                        this.selectedPotionImage = this.add.image(this.dropzone.x, this.dropzone.y, `potion${potionId}`).setScale(2, 2);
                        quantityText.setText(`x${pq.quantity - 1}`);
                        this.inventory.find(q => q.potionId == potionId).quantity -= 1;
                    }
                })

                // Set drop zone
                potionImage.on('drop', (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
                    const potionId = potionImage.getData('potionId');
                    if (dropZone === this.dropzone) {
                        if (this.selectedPotionId) {
                            this.selectedPotionImage.destroy();
                            const previousQuantityText = this.potionsContainer.list.find((go: Phaser.GameObjects.GameObject) => go.data?.get("potionQuantityId") == this.selectedPotionId && go instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text;
                            this.inventory.find(q => q.potionId == this.selectedPotionId).quantity += 1;
                            previousQuantityText?.setText(`x${this.inventory.find((q) => q.potionId == this.selectedPotionId).quantity}`);
                        }
                        this.selectedPotionId = potionId;
                        this.selectedPotionImage = this.add.image(this.dropzone.x, this.dropzone.y, `potion${potionId}`).setScale(2, 2);
                        quantityText.setText(`x${pq.quantity - 1}`);
                        this.inventory.find(q => q.potionId == potionId).quantity -= 1;
                    }
                });

                // Set pointer over event for potions
                this.potionManager.processData();
                potionImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                    const potionId = potionImage.getData('potionId');
                    const potion = this.potionManager.potions.find(potion => potion.potionId == potionId);
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

                this.potionsContainer.add(potionImage);
            }
            if (column % 5 == 0) {
                row += 1;
                column = 1;
            } else {
                column += 1;
            }
        }
    }
}