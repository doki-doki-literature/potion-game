import * as Phaser from "phaser";
import { PotionManager } from "../data/PotionManager";
import { SaveManager } from "../data/SaveManager";
import { PotionQuantity } from "../objects/PotionQuantity";
import { SceneUtils } from  "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Craft",
};

export class CraftScene extends Phaser.Scene {
    static readonly TILE_SIZE = 48;
    private potionManager: PotionManager;
    private currentPage: number = 0;
    private ingredientsPerPage: number = 10;
    private totalPages: number;
    private selectedIngredients: Array<number> = []
    private cauldronDropZone: Phaser.GameObjects.Zone;
    private ingredientsContainer: Phaser.GameObjects.Container;
    private selectedItem1Image: Phaser.GameObjects.Image;
    private selectedItem2Image: Phaser.GameObjects.Image;
    private ingredientDescriptionText: Phaser.GameObjects.Text;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.potionManager = new PotionManager(this);
        this.ingredientsContainer = this.add.container(0, 0).setName('ingredients');

        // Load potion and ingredient JSON data
        this.potionManager.loadPotions();
        this.potionManager.loadIngredients();

        for (let i = 1; i < 11; i++) {
            this.load.image(`ingredient${i}`, `assets/image/ingredient${i}.png`);
        }

        for (let i = 1; i < 31; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }
        this.load.image('cauldron', 'assets/image/cauldron.png');
        SceneUtils.loadUi(this);
        SceneUtils.loadBackground(this);
    }

    create() {
        // Add the background image to the scene
        SceneUtils.addBackground(this);
        SceneUtils.addItemSelectContainer(this);

        this.add.text(190, 150, "Drag Ingredients");
        this.add.text(560, 150, "Selected Ingredients");

        // Process loaded data
        this.potionManager.processData();
        let ingredientsData = this.potionManager.ingredients;

        // Create a text object to display ingredient description
        this.ingredientDescriptionText = this.add.text(0, 0, '', { color: '#ffffff', backgroundColor: '#000000' });
        this.ingredientDescriptionText.setDepth(1); // Ensure the text is above other elements
        this.ingredientDescriptionText.setWordWrapWidth(400);
        this.ingredientDescriptionText.setVisible(false); // Initially hide the text

        // Set pointer out event to hide ingredient description text
        this.input.on('pointerout', () => {
            // Hide the text when the cursor moves away from the ingredient
            this.ingredientDescriptionText.setVisible(false);
        });

        let resultText = this.add.text(20, 320, '', { color: '#ffffff' });
        let visualDescriptionText = this.add.text(20, 350, '', { color: '#ffffff' });

        // Create a container for the cauldron
        this.add.image(650, 550, 'cauldron').setScale(.5, .5);

        // Create a drop zone for the cauldron
        const dropZoneImage = this.add.image(655, 250, 'selectedIngredients').setScale(.55, .55);
        this.add.image(600, 250, 'inventoryTile').setScale(.6, .6);
        this.add.image(710, 250, 'inventoryTile').setScale(.6, .6);

        this.cauldronDropZone = this.add.zone(600, 250, 400, 500);
        this.cauldronDropZone.setDropZone();

        // Calculate total pages
        this.totalPages = Math.ceil(ingredientsData.length / this.ingredientsPerPage);

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
        this.updatePage(ingredientsData);

        // Set drag event for ingredients
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.children.bringToTop(gameObject); // Bring the dragged object to the top
        });

        const clearButton = this.add.image(710, 350, 'clearButton').setScale(.45, .5).setInteractive()
            .on('pointerdown', () => {
                this.selectedIngredients = [];
                this.selectedItem1Image?.destroy();
                this.selectedItem2Image?.destroy();
            })

        const clearButtonText = this.add.text(685, 340, "Clear");

        // Create craft button
        const craftButton = this.add.image(600, 350, 'confirmButton').setScale(.45, .5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (this.selectedIngredients.length === 2) {
                    const ingredientIds = this.selectedIngredients;

                    // Attempt to craft potion
                    const result = this.tryCraft(ingredientIds[0], ingredientIds[1]);
                    if (result.isValid) {
                        const matchedPotion = this.potionManager.potions.find(potion => potion.potionId == result.potionId)!;
                        let discoveredPotions = SaveManager.loadPotionLog();
                        let inventory = SaveManager.loadInventory();
                        let matchedInventory = inventory.find((pq: PotionQuantity) => pq.potionId == matchedPotion.potionId);
                        if (matchedInventory) {
                            matchedInventory.quantity = matchedInventory.quantity + 1;
                        } else {
                            inventory.push(new PotionQuantity({ potionId: matchedPotion.potionId, quantity: 1 }));
                        }
                        SaveManager.saveInventory(inventory);
                        let name;
                        if (discoveredPotions.find(potionId => potionId == result.potionId)) {
                            name = matchedPotion.name;
                        } else {
                            name = "???";
                        }

                        // Add white text on top of the overlay

                        //Temporarily removed potion discovery to check potion names
                        const text1 = this.add.text(this.cameras.main.width / 2, 300, "You have crafted: " +  result.name, { color: '#ffffff' });
                        // const text1 = this.add.text(this.cameras.main.width / 2, 300, "You have crafted: " +  name, { color: '#ffffff' });

                        text1.setOrigin(0.5);
                        text1.setInteractive();
                        text1.setDepth(4);
                        text1.setWordWrapWidth(300);

                        //Used effect description for text2
                        const text2 = this.add.text(this.cameras.main.width / 2, 350, matchedPotion.effectDescription, { color: '#ffffff' });

                        // const text2 = this.add.text(this.cameras.main.width / 2, 350, matchedPotion.visualDescription, { color: '#ffffff' });
                        text2.setOrigin(0.5);
                        text2.setInteractive();
                        text2.setDepth(4);
                        text2.setWordWrapWidth(300);

                        const potionImage = this.add.image(this.cameras.main.width / 2, 175, "potion" + matchedPotion.potionId.toString());
                        potionImage.setOrigin(0.5);
                        potionImage.setDepth(4);
                        potionImage.setInteractive();
                        potionImage.setScale(10, 10);
                        // Create a grey transparent rectangle covering the entire screen
                        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
                        overlay.setOrigin(0);
                        overlay.setInteractive();
                        overlay.setDepth(3);
                        overlay.on("pointerdown", () => { 
                            overlay.destroy();
                            text1.destroy();
                            text2.destroy();
                            potionImage.destroy();
                        });
                    } else {
                        // Add white text on top of the overlay

                        //Temporarily removed potion discovery to check potion names
                        const text1 = this.add.text(this.cameras.main.width / 2, 300, "Alchemy failed! :(", { color: '#ffffff' });
                        // const text1 = this.add.text(this.cameras.main.width / 2, 300, "You have crafted: " +  name, { color: '#ffffff' });

                        text1.setOrigin(0.5);
                        text1.setInteractive();
                        text1.setDepth(4);
                        text1.setWordWrapWidth(300);

                        //Used effect description for text2
                        const text2 = this.add.text(this.cameras.main.width / 2, 350, "You have crafted a mistake! It happens!", { color: '#ffffff' });

                        // const text2 = this.add.text(this.cameras.main.width / 2, 350, matchedPotion.visualDescription, { color: '#ffffff' });
                        text2.setOrigin(0.5);
                        text2.setInteractive();
                        text2.setDepth(4);
                        text2.setWordWrapWidth(300);

                        const potionImage = this.add.image(this.cameras.main.width / 2, 175, "potion1");
                        potionImage.setOrigin(0.5);
                        potionImage.setDepth(4);
                        potionImage.setInteractive();
                        potionImage.setScale(10, 10);
                        // Create a grey transparent rectangle covering the entire screen
                        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
                        overlay.setOrigin(0);
                        overlay.setInteractive();
                        overlay.setDepth(3);
                        overlay.on("pointerdown", () => { 
                            overlay.destroy();
                            text1.destroy();
                            text2.destroy();
                            potionImage.destroy();
                        });
                        visualDescriptionText.setText("");
                    }

                    // Clear selected ingredients
                    this.selectedIngredients = [];
                } else {
                    console.log('Please select two ingredients before crafting a potion.');
                }
            });
        const craftButtonText = this.add.text(570, 340, "Create");

        SceneUtils.addNavigation(this);
    }

    tryCraft(ingredientId1: number, ingredientId2: number): { isValid: boolean, potionId?: number, name?: string } {
        this.selectedItem1Image.destroy();
        this.selectedItem2Image.destroy();
        if (this.selectedIngredients.length > 2) {
            this.selectedIngredients = [];
            return { isValid: false };
        }

        const matchingPotion = this.potionManager.potions.find(potion => {
            return (
                (potion.ingredientId1 === ingredientId1 && potion.ingredientId2 === ingredientId2) ||
                (potion.ingredientId1 === ingredientId2 && potion.ingredientId2 === ingredientId1)
            );
        });

        if (matchingPotion) {
            this.selectedIngredients = [];
            return { isValid: true, potionId: matchingPotion.potionId, name: matchingPotion.name };
        } else {
            this.selectedIngredients = [];
            return { isValid: false };
        }
    }

    updatePage(ingredientsData: any[]) {
        // Clear existing ingredients
        this.ingredientsContainer.destroy();

        // Create a new container for ingredients on the current page
        this.ingredientsContainer = this.add.container(0, 0).setName('ingredients');
        const startX = 80;
        const spacingX = 90;
        const spacingY = 90;
        const startY = 160;

        // Calculate start and end index for current page
        const startIndex = this.currentPage * this.ingredientsPerPage;
        const endIndex = Math.min(startIndex + this.ingredientsPerPage, ingredientsData.length);
        let row = 0;
        let column = 0;
        // Display ingredients for the current page
        for (let i = startIndex; i < 15; i++) {
            column += 1;

            if (i % 5 == 0) {
                row += 1;
                column = 0;
            }

            let originalX = startX + column * spacingX;
            let originalY = startY + row * spacingY;
            const ingredientContainer = this.add.image(originalX, originalY, 'inventoryTile').setDepth(-1).setScale(.6, .6);

            const ingredient = ingredientsData[i];
            if (!!ingredient) {
                let ingredientImage = this.add.image(originalX, originalY, `ingredient${ingredient.ingredientId}`).setScale(2.5, 2.5);

            ingredientImage.setData('ingredientId', ingredient.ingredientId);
            ingredientImage.setInteractive();
            this.input.setDraggable(ingredientImage);

            // Set drag event for cauldron
            ingredientImage.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                ingredientImage.setX(pointer.x);
                ingredientImage.setY(pointer.y);
            });

            ingredientImage.on('dragend', (pointer: Phaser.Input.Pointer) => {
                ingredientImage.setX(originalX);
                ingredientImage.setY(originalY);
            });

            // Set drop zone for cauldron
            ingredientImage.on('drop', (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
                const ingredientId = ingredientImage.getData('ingredientId');
                if (dropZone === this.cauldronDropZone && this.selectedIngredients.length < 2) {
                    if (this.selectedIngredients.length == 1) {
                        this.selectedItem1Image = this.add.image(this.cauldronDropZone.x + 110, this.cauldronDropZone.y + 5, `ingredient${ingredient.ingredientId}`).setScale(2, 2);
                    } else {
                        this.selectedItem2Image = this.add.image(this.cauldronDropZone.x, this.cauldronDropZone.y + 5, `ingredient${ingredient.ingredientId}`).setScale(2, 2);
                    }

                    // Add the ingredient to the selected ingredients
                    this.selectedIngredients.push(ingredientId);
                }
            });

            // Set pointer over event for ingredients
            ingredientImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                const ingredientId = ingredientImage.getData('ingredientId');
                const ingredient = this.potionManager.ingredients.find(ingredient => ingredient.ingredientId == ingredientId);
                if (ingredient) {
                    // Set text position to match cursor
                    this.ingredientDescriptionText.setPosition(pointer.x - 150, pointer.y + 30);
                    // Set text content to ingredient description
                    this.ingredientDescriptionText.setText(ingredient.name + ": " + ingredient.description);
                    // Show the text
                    this.ingredientDescriptionText.setVisible(true);
                }
            });

            this.ingredientsContainer.add(ingredientImage);
            }
        }
    }
}