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
        const backButton = scene.add.image(75, 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(55, 35, 'Back');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Cabin");
        });
    }

    private static addCauldronButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(205, scene.scene.key == "Craft" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(165, scene.scene.key == "Craft" ? 65 : 35, 'Cauldron');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Craft");
        });
    }

    private static addInventoryButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(335, scene.scene.key == "Inventory" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(290, scene.scene.key == "Inventory" ? 65 : 35, 'Inventory');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Inventory");
        });
    }

    private static addQuestLogButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(465, scene.scene.key == "Quest" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(420, scene.scene.key == "Quest" ? 65 : 35, 'Quest Log');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Quest");
        });
    }

    private static addTownButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(595, scene.scene.key == "Gossip" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(575, scene.scene.key == "Gossip" ? 65 : 35, 'Town');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Gossip");
        });
    }

    private static addArchiveButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(725, scene.scene.key == "Archive" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6);
        scene.add.text(690, scene.scene.key == "Archive" ? 65 : 35, 'Archive');
        backButton.on("pointerdown", () => {
            return scene.scene.start("Archive");
        });
    }

    private static renderInventoryUi(scene: Phaser.Scene) {

    }
}