import * as Phaser from "phaser";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";
import { SoundManager } from "../objects/SoundManager";

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
        scene.load.image('star', 'assets/image/ui-assets/rating_star.png');
        scene.load.image('townTextbox', 'assets/image/ui-assets/town_textbox.png');
        scene.load.image('bean', 'assets/image/bean.png');
        scene.load.bitmapFont('handwritten', 'assets/fonts/Fool_0.png', 'assets/fonts/Fool.fnt');
        scene.load.image('button', 'assets/image/ui-assets/button.png');
        scene.load.image('hoverButton', 'assets/image/ui-assets/hover_button.png');
        scene.load.image('backButton', 'assets/image/ui-assets/back_button.png');
        scene.load.image('hoverBackButton', 'assets/image/ui-assets/hover_back_button.png');
    }

    static loadBackground(scene: Phaser.Scene) {
        scene.load.image('background', 'assets/image/drawings/cabin-draft.png');
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
        const backButton = scene.add.image(75, 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(50, 35, 'Cabin').setDepth(4);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Cabin");
        });
    }

    private static addCauldronButton(scene: Phaser.Scene) {
        const cauldronButton = scene.add.image(205, scene.scene.key == "Craft" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(165, scene.scene.key == "Craft" ? 65 : 35, 'Cauldron').setDepth(4);
        cauldronButton.on("pointerdown", () => {
            return scene.scene.start("Craft");
        });
    }

    private static addInventoryButton(scene: Phaser.Scene) {
        const invButton = scene.add.image(335, scene.scene.key == "Inventory" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(290, scene.scene.key == "Inventory" ? 65 : 35, 'Inventory').setDepth(4);
        invButton.on("pointerdown", () => {
            return scene.scene.start("Inventory");
        });
    }

    private static addQuestLogButton(scene: Phaser.Scene) {
        const questButton = scene.add.image(465, scene.scene.key == "Quest" || scene.scene.key == "QuestGiver" || scene.scene.key == "QuestFinish" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(438, scene.scene.key == "Quest" || scene.scene.key == "QuestGiver" || scene.scene.key == "QuestFinish" ? 65 : 35, 'Quest').setDepth(4);
        questButton.on("pointerdown", () => {
            const questManager = new QuestManager(scene);
            questManager.loadQuests();
            questManager.processData();
            questManager.processActiveQuests();
            return scene.scene.start("Quest");
        });
    }

    private static addTownButton(scene: Phaser.Scene) {
        const townButton = scene.add.image(595, scene.scene.key == "Gossip" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(575, scene.scene.key == "Gossip" ? 65 : 35, 'Town').setDepth(4);
        townButton.on("pointerdown", () => {
            return scene.scene.start("Gossip");
        });
    }

    private static addArchiveButton(scene: Phaser.Scene) {
        const arcButton = scene.add.image(725, scene.scene.key == "Archive" ? 40 : 10, 'navSign').setInteractive().setScale(.6, .6).setDepth(3);
        scene.add.text(690, scene.scene.key == "Archive" ? 65 : 35, 'Archive').setDepth(4);
        arcButton.on("pointerdown", () => {
            return scene.scene.start("Archive");
        });
    }

    static addBackground(scene: Phaser.Scene) {
        const backgroundImage = scene.add.image(0, 0, 'background').setOrigin(0);

        // Set the background image to cover the entire game canvas
        backgroundImage.setDepth(-3);
        backgroundImage.setAlpha(.2);
        backgroundImage.displayWidth = scene.game.canvas.width;
        backgroundImage.displayHeight = scene.game.canvas.height;
    }

    static addItemSelectContainer(scene: Phaser.Scene) {
        scene.add.image(5, 180, 'selectIngredients').setDepth(-1).setOrigin(0, 0).setScale(.6, .6);
    }

    static addBeanCounter(scene: Phaser.Scene) {
        scene.add.image(scene.cameras.main.width / 16, scene.cameras.main.height * 7.4 / 8, 'bean').setDepth(6).setScale(.06, .06);
        scene.add.text(scene.cameras.main.width * 1.5 / 16, scene.cameras.main.height * 7.4 / 8, 'x' + SaveManager.loadBeans()).setDepth(6).setColor('#ffffff').setFontSize(24);
    }

    // tried making a util for the hover button, but there's too much specific things i.e what happens on pointerdown and setScale of button
    static addButtonHover(scene: Phaser. Scene, button: Phaser.GameObjects.Image, x: number, y: number, depth, scaleX: number, scaleY: number) {
        const hoverButton = scene.add.image(x,  y, 'hoverButton').setDepth(depth).setScale(scaleX, scaleY).setAlpha(.5).setVisible(false);
        button.on("pointerover", () => {
            return hoverButton.setVisible(true);
        });
        button.on("pointerout", () => hoverButton.setVisible(false));
        return button;
    }

    // Maybe should have a background music button toggle util but then need to import SoundManager
}