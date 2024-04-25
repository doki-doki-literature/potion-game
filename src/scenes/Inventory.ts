import * as Phaser from "phaser";
import { SaveManager } from "../data/SaveManager";
import { PotionManager } from "../data/PotionManager";
import { PotionQuantity } from "../objects/PotionQuantity";
import { SceneUtils } from "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Inventory"
};

export class InventoryScene extends Phaser.Scene {
    potionManager: PotionManager;
    discoveredPotions: number[];
    inventory: Array<PotionQuantity>;
    potionDescriptionText: Phaser.GameObjects.Text;
    selectedPotionId: number;
    selectedPotionImage: Phaser.GameObjects.Image;
    dropzone: Phaser.GameObjects.Zone;
    potionsContainer: Phaser.GameObjects.Container;
    defaultText: Phaser.GameObjects.Text;
    private potionText: Phaser.GameObjects.Text;
    private descriptionText: Phaser.GameObjects.Text;
    private currentPage: number = 0;
    private potionsPerPage: number = 15;
    private totalPages: number;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.inventory = SaveManager.loadInventory();

        for (let i = 1; i < 21; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }

        // load potion images
        for (let i = 1; i < 31; i++) {
            this.load.image(`potion${i}`, `assets/image/potions/item_${i}.png`)
        }

        // load ingredient images
        for (let i = 1; i < 11; i++) {
            this.load.image(`ingredient${i}`, `assets/image/drawings/ingredients/ingredient${i}.png`)
        }

        // load potion data, ingredient data
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

        // Process loaded data
        const potionsData = this.potionManager.potions;

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

        // potions label
        this.add.text(203, 150, "Your Potions")

        // paper
        this.add.image(650, 345, 'itemDisplay').setScale(.75, .75).setDepth(-1);

        // default instructions to display on the paper
        this.defaultText = this.add.text(540, 300, 'Click or drag a potion to the box to view your notes.', { color: '#000000' });
        this.defaultText.setWordWrapWidth(235);

        // Create a container for the submission box
        this.add.image(575, 250, 'inventoryTile').setScale(.55, .55);

        // Create a drop zone for the submission box
        this.dropzone = this.add.zone(575, 250, 100, 100);
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

        // Set drag event for potions = need to change this to click
        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.children.bringToTop(gameObject); // Bring the dragged object to the top
        });
    }

    handleSubmit() {
        if (this.selectedPotionId) {
            const potionId = this.selectedPotionId;

            if (true) {
                const potion = this.potionManager.potions.find((p) => p.potionId==potionId);
                this.potionText = this.add.text(620, 240, '', { color: '#000000' });
                this.potionText.setText('');
                this.potionText.setDepth(3);
                this.potionText.setWordWrapWidth(150);
                this.descriptionText = this.add.text(540, 300, 'Click or drag a potion to the box to view your notes.', { color: '#000000' });
                this.descriptionText.setDepth(3);
                this.descriptionText.setWordWrapWidth(235);
                if (this.discoveredPotions.includes(potionId)) {
                    this.potionText.setText(potion.name)
                    this.descriptionText.setText(potion.description)
                } else {
                    this.potionText.setText("???")
                    this.descriptionText.setText("You have not yet discovered this potion's powers. Try giving the potion to quest-seekers to see if you can discover the powers through their quest experiences.")
                }
            } else {
                console.log('Please select a potion.');
            }
        }
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
                this.input.setDraggable(potionImage);

                // Set drag event
                potionImage.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                    potionImage.setX(pointer.x);
                    potionImage.setY(pointer.y);
                });

                potionImage.on('dragend', (pointer: Phaser.Input.Pointer) => {
                    potionImage.setX(originalX);
                    potionImage.setY(originalY);
                });

                // Set drop zone
                potionImage.on('drop', (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
                    const potionId = potionImage.getData('potionId');
                    if (dropZone === this.dropzone) {
                        if (this.selectedPotionId) {
                            this.selectedPotionImage.destroy();
                            this.potionText.destroy();
                            this.descriptionText.destroy();
                        }
                        this.selectedPotionId = potionId;
                        this.selectedPotionImage = this.add.image(this.dropzone.x, this.dropzone.y, `potion${potionId}`).setScale(2, 2);
                        this.handleSubmit();
                        this.defaultText.destroy();
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