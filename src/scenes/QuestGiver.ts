import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";
import { PotionManager } from "../data/PotionManager";
import { Quest } from "../objects/Quest";
import { SaveManager } from "../data/SaveManager";
import { PotionQuantity } from "../objects/PotionQuantity";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "QuestGiver",
};

export class QuestGiver extends Phaser.Scene {
    questManager: QuestManager;
    potionManager: PotionManager;
    quest: Quest;
    inventory: PotionQuantity;
    potionDescriptionText: Phaser.GameObjects.Text;
    selectedPotionId: number;
    dropzone: Phaser.GameObjects.Zone;
    potionsContainer: Phaser.GameObjects.Container;
    private currentPage: number = 0;
    private potionsPerPage: number = 10;
    private totalPages: number;


    constructor() {
        super(sceneConfig);
    }

    init(data: any) {
        const questId = data.questId;
        this.inventory = SaveManager.loadInventory();

        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();
        this.questManager.processData();

        this.quest = this.questManager.quests.find((quest) => quest.questId == questId)!;
    }

    preload() {
        // Load the background image asset
        this.load.image('background', 'assets/image/drawings/cabin-draft.png');
        for (let i = 1; i < 31; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }

        this.potionManager = new PotionManager(this);
        this.potionManager.loadPotions();
        this.potionManager.loadIngredients();

        this.potionsContainer = this.add.container(0, 0).setName('potions');
    }

    create() {
        this.potionManager.processData();

        // Create a back button
        const backButton = this.add.text(20, 50, "Back to Cabin").setInteractive();
        backButton.on("pointerdown", () => {
            return this.scene.start("Cabin");
        });

        this.add.text(100, 400, this.quest.questGiver + ": " + this.quest.content).setWordWrapWidth(300);
        console.log(this.quest)

        // Add the background image to the scene
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0);

        // Set the background image to cover the entire game canvas
        backgroundImage.setDepth(-3);
        backgroundImage.setAlpha(.2);
        backgroundImage.displayWidth = this.game.canvas.width;
        backgroundImage.displayHeight = this.game.canvas.height;

        const potionsContainer = this.add.rectangle(25, 75, 750, 500, 0xe39d2d, 1).setDepth(-1).setOrigin(0, 0);

        // Process loaded data
        this.potionManager.processData();
        let potionsData = this.potionManager.potions;
        console.log(potionsData)

        // Create a text object to display ingredient description
        this.potionDescriptionText = this.add.text(0, 0, '', { color: '#ffffff', backgroundColor: '#000000' });
        this.potionDescriptionText.setDepth(1); // Ensure the text is above other elements
        this.potionDescriptionText.setWordWrapWidth(400);
        this.potionDescriptionText.setVisible(false); // Initially hide the text

        // Set pointer out event to hide ingredient description text
        this.input.on('pointerout', () => {
            // Hide the text when the cursor moves away from the ingredient
            this.potionDescriptionText.setVisible(false);
        });

        let resultText = this.add.text(20, 320, '', { color: '#ffffff' });
        let visualDescriptionText = this.add.text(20, 350, '', { color: '#ffffff' });

        // Create a container for the cauldron
        this.add.rectangle(700, 450, 64, 64);

        // Create a drop zone for the cauldron
        this.dropzone = this.add.zone(700, 400, 100, 100);
        this.dropzone.setDropZone();

        // Calculate total pages
        // this.totalPages = Math.ceil(ingredientsData.length / this.ingredientsPerPage);

        // Create pagination buttons
        // const prevButton = this.add.text(50, 240, 'Prev', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
        //     this.currentPage = Phaser.Math.Clamp(this.currentPage - 1, 0, this.totalPages - 1);
        //     this.updatePage(ingredientsData);
        // });

        // const nextButton = this.add.text(50, 270, 'Next', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
        //     this.currentPage = Phaser.Math.Clamp(this.currentPage + 1, 0, this.totalPages - 1);
        //     this.updatePage(ingredientsData);
        // });

        // Initialize current page
        this.updatePage(potionsData);

        // Set drag event for ingredients
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.children.bringToTop(gameObject); // Bring the dragged object to the top
        });

        // Create craft button
        const craftButton = this.add.text(630, 200, 'Submit', { color: '#ffffff', backgroundColor: '#964B00', padding: { x: 10, y: 10 } })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
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
                        });
                    }

                    // Clear selected ingredients
                    this.selectedPotionId = null;
                } else {
                    console.log('Please select a potion.');
                }
            });
    }

    updatePage(potionsData: any[]) {
        // Clear existing potions
        this.potionsContainer.destroy();

        // Create a new container for ingredients on the current page
        this.potionsContainer = this.add.container(0, 0).setName('potions');
        const startX = 120;
        const spacingX = 90;

        // Calculate start and end index for current page
        const startIndex = this.currentPage * this.potionsPerPage;
        const endIndex = Math.min(startIndex + this.potionsPerPage, potionsData.length);
        let row = 0;
        let column = 0;
        // Display ingredients for the current page
        for (let i = startIndex; i < endIndex; i++) {
            column += 1;

            if (i % 5 == 0) {
                row += 1;
                column = 0;
            }

            let originalX = startX + column * spacingX;
            let originalY = 250 + row * 80;
            const potionContainer = this.add.rectangle(originalX, originalY, 64, 64, 0x964B00, 1).setDepth(-1);

            const potion = potionsData[i];
            let potionImage = this.add.image(originalX, originalY, `potion${potion.potionId}`).setScale(2, 2);

            potionImage.setData('potionId', potion.potionId);
            potionImage.setInteractive();
            this.input.setDraggable(potionImage);

            // Set drag event for cauldron
            potionImage.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                potionImage.setX(pointer.x);
                potionImage.setY(pointer.y);
            });

            potionImage.on('dragend', (pointer: Phaser.Input.Pointer) => {
                potionImage.setX(originalX);
                potionImage.setY(originalY);
            });

            // Set drop zone for cauldron
            potionImage.on('drop', (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
                const potionId = potionImage.getData('potionId');
                if (dropZone === this.dropzone) {
                    // this.selectedPotionId = ;
                }
            });

            // Set pointer over event for potions
            potionImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                const potionId = potionImage.getData('potionId');
                const potion = this.potionManager.potions.find(potion => potion.potionId == potionId);
                if (potion) {
                    // Set text position to match cursor
                    this.potionDescriptionText.setPosition(pointer.x - 150, pointer.y + 30);
                    // Set text content to ingredient description
                    this.potionDescriptionText.setText(potion.name + ": " + potion.description);
                    // Show the text
                    this.potionDescriptionText.setVisible(true);
                }
            });

            this.potionsContainer.add(potionImage);
        }
    }
}