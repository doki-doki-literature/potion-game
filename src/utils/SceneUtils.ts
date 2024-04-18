import * as Phaser from "phaser";

export class SceneUtils {
    static loadUi(scene: Phaser.Scene) {
        scene.load.image('navSign', 'assets/image/ui-assets/nav_sign_button.png');
        scene.load.image('clearButton', 'assets/image/ui-assets/clear_button.png');
        scene.load.image('confirmButton', 'assets/image/ui-assets/confirm_button.png');
        scene.load.image('itemDisplay', 'assets/image/ui-assets/inventory_item_display.png');
        scene.load.image('inventoryNav1', 'assets/image/ui-assets/inventory_nav_1.png');
        scene.load.image('inventoryNav2', 'assets/image/ui-assets/inventory_nav_2.png');
        scene.load.image('inventory', 'assets/image/ui-assets/inventory.png');
        scene.load.image('inventoryTile', 'assets/image/ui-assets/inventory_tile.png');
        scene.load.image('selectIngredients', 'assets/image/ui-assets/select_ingredients.png');
        scene.load.image('selectedIngredients', 'assets/image/ui-assets/selected_ingredients.png');
    }

    static addNavigation(scene: Phaser.Scene) {
        this.addBackButton(scene);
        this.addCauldronButton(scene);
        this.addInventoryButton(scene);
        this.addQuestLogButton(scene);
        this.addTownButton(scene);
        this.addArchiveButton(scene);
    }

    private static addBackButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(180, 10, 'navSign').setInteractive().setScale(.75, .75);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Cabin");
        });
    }

    private static addCauldronButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(300, scene.scene.key == "Craft" ? 50 : 10, 'navSign').setInteractive().setScale(.75, .75);

        backButton.on("pointerdown", () => {
            return scene.scene.start("Craft");
        });
    }

    private static addInventoryButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(420, 10, 'navSign').setInteractive().setScale(.75, .75);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Inventory");
        });
    }
    
    private static addQuestLogButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(540, 10, 'navSign').setInteractive().setScale(.75, .75);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Quest");
        });
    }

    private static addTownButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(660, 10, 'navSign').setInteractive().setScale(.75, .75);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Gossip");
        });
    }

    private static addArchiveButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(780, 10, 'navSign').setInteractive().setScale(.75, .75);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Archive");
        });
    }

    private static renderInventoryUi(scene: Phaser.Scene) {
        
    }
}