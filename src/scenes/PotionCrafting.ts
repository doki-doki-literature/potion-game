import * as Phaser from "phaser";
import { PotionManager } from "../data/PotionManager";
import { SaveManager } from "../data/SaveManager";

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
        this.potionManager.loadPotions('src/data/recipes.json');
        this.potionManager.loadIngredients('src/data/ingredients.json');
        for (let i = 1; i < 11; i++) {
            this.load.image(`ingredient${i}`, `assets/image/ingredient${i}.png`);
        }
        this.load.image('cauldron', 'assets/image/cauldron.png');
    }

    create() {
        // Process loaded data
        this.potionManager.processData();
        let ingredientsData = this.potionManager.ingredients;

        // Create a text object to display ingredient description
        this.ingredientDescriptionText = this.add.text(0, 0, '', { color: '#ffffff', backgroundColor: '#000000' });
        this.ingredientDescriptionText.setDepth(1); // Ensure the text is above other elements
        this.ingredientDescriptionText.setWordWrapWidth(400);
        this.ingredientDescriptionText.setVisible(false); // Initially hide the text

        // Create a back button
        const backButton = this.add.text(20, 50, "Back to Cabin").setInteractive();
        backButton.on("pointerdown", () => this.scene.start("Cabin"));

        // Set pointer out event to hide ingredient description text
        this.input.on('pointerout', () => {
            // Hide the text when the cursor moves away from the ingredient
            this.ingredientDescriptionText.setVisible(false);
        });

        let resultText = this.add.text(20, 320, '', { color: '#ffffff' });
        let visualDescriptionText = this.add.text(20, 350, '', { color: '#ffffff' });

        // Create a container for the cauldron
        const cauldronImage = this.add.image(700, 450, 'cauldron').setScale(.5, .5);

        // Create a drop zone for the cauldron
        this.cauldronDropZone = this.add.zone(700, 450, 100, 100);
        this.cauldronDropZone.setDropZone();

        // Calculate total pages
        this.totalPages = Math.ceil(ingredientsData.length / this.ingredientsPerPage);

        // Create pagination buttons
        const prevButton = this.add.text(50, 240, 'Prev', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
            this.currentPage = Phaser.Math.Clamp(this.currentPage - 1, 0, this.totalPages - 1);
            this.updatePage(ingredientsData);
        });

        const nextButton = this.add.text(50, 270, 'Next', { color: '#ffffff' }).setInteractive().on('pointerdown', () => {
            this.currentPage = Phaser.Math.Clamp(this.currentPage + 1, 0, this.totalPages - 1);
            this.updatePage(ingredientsData);
        });

        // Initialize current page
        this.updatePage(ingredientsData);

        // Set drag event for ingredients
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.children.bringToTop(gameObject); // Bring the dragged object to the top
        });

        // Create craft button
        const craftButton = this.add.text(630, 200, 'Craft Potion', { color: '#ffffff', backgroundColor: '#0000ff', padding: { x: 10, y: 5 } })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (this.selectedIngredients.length === 2) {
                    const ingredientIds = this.selectedIngredients;
                    console.log('Selected ingredient IDs:', ingredientIds);

                    // Attempt to craft potion
                    const result = this.tryCraft(ingredientIds[0], ingredientIds[1]);
                    if (result.isValid) {
                        console.log('Craft successful! Potion ID:', result.potionId);

                        resultText.setText("Alchemy Successful!");
                        const matchedPotion = this.potionManager.potions.find(potion => potion.potionId == result.potionId)!;
                        let discoveredPotions = SaveManager.loadPotionLog();
                        let inventory = SaveManager.loadInventory();
                        if (inventory[matchedPotion.potionId]) {
                            inventory[matchedPotion.potionId] = inventory[matchedPotion.potionId] + 1;
                        } else {
                            inventory[matchedPotion.potionId] = 1;
                        }
                        SaveManager.saveInventory(inventory);
                        let name;
                        if (discoveredPotions.find(potionId => potionId == result.potionId)) {
                            name = matchedPotion.name;
                        } else {
                            name = "???";
                        }
                        const overlayScene = this.scene.get("OverlayScene");
                        overlayScene.data.set("text1", "You have crafted " + name + " " + matchedPotion.visualDescription);
                        overlayScene.scene.setVisible(true);

                    } else {
                        resultText.setText("Alchemy failed");
                        visualDescriptionText.setText("");
                        console.log('Craft failed. No valid potion found.');
                    }

                    // Clear selected ingredients
                    this.selectedIngredients = [];
                } else {
                    console.log('Please select two ingredients before crafting a potion.');
                }
            });
    }

    tryCraft(ingredientId1: number, ingredientId2: number): { isValid: boolean, potionId?: number } {
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
            return { isValid: true, potionId: matchingPotion.potionId };
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
        const startX = 160;
        const spacingX = 90;

        // Calculate start and end index for current page
        const startIndex = this.currentPage * this.ingredientsPerPage;
        const endIndex = Math.min(startIndex + this.ingredientsPerPage, ingredientsData.length);
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
            let originalY = 200 + row * 40;

            const ingredient = ingredientsData[i];
            let ingredientImage = this.add.image(originalX, originalY, `ingredient${ingredient.ingredientId}`);

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
                        this.selectedItem1Image = this.add.image(this.cauldronDropZone.x + 10, this.cauldronDropZone.y - 20, `ingredient${ingredient.ingredientId}`);
                    } else {
                        this.selectedItem2Image = this.add.image(this.cauldronDropZone.x - 10, this.cauldronDropZone.y - 20, `ingredient${ingredient.ingredientId}`);
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