import * as Phaser from "phaser";
import { SoundManager } from "../objects/SoundManager";
import { SceneUtils } from "../utils/SceneUtils";
import { QuestManager } from "../data/QuestManager";
import { SaveManager } from "../data/SaveManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Cabin"
};

export class CabinScene extends Phaser.Scene {
    soundManager: SoundManager;
    hoverCrystal: Phaser.GameObjects.Image;
    hoverQuest: Phaser.GameObjects.Image;
    hoverBook: Phaser.GameObjects.Image;
    hoverCauldron: Phaser.GameObjects.Image;
    hoverInv: Phaser.GameObjects.Image;
    hoverText: Phaser.GameObjects.Text;
    questManager: QuestManager;
    rewards: string[];

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('cabin', 'assets/image/drawings/cabin-draft.png');
        this.load.image('cauldron', 'assets/image/drawings/cauldron.png');
        this.load.image('book', 'assets/image/drawings/book.png');
        this.load.image('crystalBall', 'assets/image/drawings/crystal-ball.png');
        this.load.image('questBoard', 'assets/image/drawings/questboard.png');

        // load hover glows
        this.load.image('hoverCrystal', 'assets/image/ui-assets/hover_crystal_ball_cabin.png')
        this.load.image('hoverBook', 'assets/image/ui-assets/hover_book_cabin.png');
        this.load.image('hoverQuest', 'assets/image/ui-assets/hover_quest_cabin.png');
        this.load.image('hoverCauldron', 'assets/image/ui-assets/hover_cabin_cauldron.png');

        // load sound
        this.load.image('soundMuteButton', 'assets/image/ui-assets/volume_muted_button.png')
        this.load.image('soundUnmuteButton', 'assets/image/ui-assets/volume_unmuted_button.png')
        this.load.image('bean', 'assets/image/bean.png');
        this.load.bitmapFont('handwritten', 'assets/fonts/Fool_0.png', 'assets/fonts/Fool.fnt');
        this.load.image('townTextbox', 'assets/image/ui-assets/town_textbox.png');
        this.soundManager = new SoundManager(this);
        this.soundManager.preload();

        this.questManager = new QuestManager(this);
        this.questManager.loadQuests();

        // load rewards from local storage
        this.rewards = SaveManager.loadRewards();

        // load reward images
        this.load.image('boot', 'assets/image/drawings/rewards/boot.png');
        this.load.image('deerHead', 'assets/image/drawings/rewards/deer-head.png');
        this.load.image('dragonScale', 'assets/image/drawings/rewards/dragon-scale.png');
        this.load.image('rose', 'assets/image/drawings/rewards/rose.png');
    }

    create() {
        SceneUtils.addBeanCounter(this);
        this.questManager.processData();
        this.questManager.processActiveQuests();

        // background music button toggle
        const soundMuteButton = this.add.image(775, 25, 'soundMuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(0.5);
        const soundUnmuteButton = this.add.image(775, 25, 'soundUnmuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(0.5).setVisible(false);

        soundMuteButton.on("pointerdown", () => {
            this.soundManager.stop('backgroundMusic')
            soundMuteButton.setVisible(false);
            soundUnmuteButton.setVisible(true);
        });
        soundUnmuteButton.on("pointerdown", () => {
            this.soundManager.play('backgroundMusic')
            soundUnmuteButton.setVisible(false);
            soundMuteButton.setVisible(true);
        });

        // hover text
        this.hoverText = this.add.text(0, 0, '', { color: '#ffffff', backgroundColor: '#000000' });
        this.hoverText.setDepth(3); // Ensure the text is above other elements
        this.hoverText.setWordWrapWidth(400);
        this.hoverText.setVisible(false);
        this.hoverText.setScale(1);

        // set pointer out event to hide hover text
        this.input.on('pointerout', () => {
            // Hide the text when the cursor moves away from the object
            this.hoverText.setVisible(false);
        });

        const cabinImage = this.add.image(400, 300, 'cabin').setScale(0.7, .84);

        const crystalBallImage = this.add.image(700, 150, 'crystalBall').setScale(0.7,0.7).setInteractive();
        crystalBallImage.on("pointerdown", () => this.scene.start("Gossip"));
        this.hoverCrystal = this.add.image(696, 150, 'hoverCrystal').setScale(.77, .77).setDepth(1).setVisible(false);
        crystalBallImage.on("pointerover", () => this.hoverCrystal.setVisible(true).setAlpha(.1));
        crystalBallImage.on("pointerout", () => this.hoverCrystal.setVisible(false));
        crystalBallImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            // Set text position to match cursor
            this.hoverText.setPosition(pointer.x - 50, pointer.y + 30);
            // Set text content to ingredient description
            this.hoverText.setText("Listen in on the townpeoples' gossip");
            this.hoverText.setWordWrapWidth(75);
            // Show the text
            this.hoverText.setVisible(true);
        });

        const questBoardImage = this.add.image(350, 100, 'questBoard').setScale(0.7, 0.7).setInteractive().setDepth(2);
        questBoardImage.on("pointerdown", () => this.scene.start("Quest"));
        this.hoverQuest = this.add.image(346, 100, 'hoverQuest').setScale(.77, .77).setDepth(1).setVisible(false);
        questBoardImage.on("pointerover", () => this.hoverQuest.setVisible(true).setAlpha(.2));
        questBoardImage.on("pointerout", () => this.hoverQuest.setVisible(false));
        questBoardImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            // Set text position to match cursor
            this.hoverText.setPosition(pointer.x - 50, pointer.y + 30);
            // Set text content to ingredient description
            this.hoverText.setText("Read available quests");
            this.hoverText.setWordWrapWidth(75);
            // Show the text
            this.hoverText.setVisible(true);
        });

        const cauldronImage = this.add.image(700, 425, 'cauldron').setScale(.65, .65).setInteractive();
        cauldronImage.on("pointerdown", () => this.scene.start("Craft"));
        this.hoverCauldron = this.add.image(696, 425, 'hoverCauldron').setScale(.65, .65).setDepth(1).setVisible(false);
        cauldronImage.on("pointerover", () => this.hoverCauldron.setVisible(true).setAlpha(.1));
        cauldronImage.on("pointerout", () => this.hoverCauldron.setVisible(false));
        cauldronImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            // Set text position to match cursor
            this.hoverText.setPosition(pointer.x - 50, pointer.y + 30);
            // Set text content to ingredient description
            this.hoverText.setText("Craft new potions");
            this.hoverText.setWordWrapWidth(75);
            // Show the text
            this.hoverText.setVisible(true);
        });

        const bookImage = this.add.image(325, 275, "book").setScale(.8, .8).setInteractive();
        bookImage.on("pointerdown", () => this.scene.start("Archive"));
        this.hoverBook = this.add.image(321, 275, 'hoverBook').setScale(.87, .87).setDepth(1).setVisible(false);
        bookImage.on("pointerover", () => this.hoverBook.setVisible(true).setAlpha(.1));
        bookImage.on("pointerout", () => this.hoverBook.setVisible(false));
        bookImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            // Set text position to match cursor
            this.hoverText.setPosition(pointer.x - 50, pointer.y + 30);
            // Set text content to ingredient description
            this.hoverText.setText("Your potion book");
            this.hoverText.setWordWrapWidth(75);
            // Show the text
            this.hoverText.setVisible(true);
        });

        const inventoryImage = this.add.image(50, 200, 'hoverQuest').setScale(.35, 1.8).setInteractive().setAlpha(0.01);
        inventoryImage.on("pointerdown", () => this.scene.start("Inventory"));
        this.hoverInv = this.add.image(50, 200, 'hoverQuest').setScale(.35, 1.8).setDepth(1).setVisible(false);
        inventoryImage.on("pointerover", () => this.hoverInv.setVisible(true).setAlpha(.1));
        inventoryImage.on("pointerout", () => this.hoverInv.setVisible(false));
        inventoryImage.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            // Set text position to match cursor
            this.hoverText.setPosition(pointer.x - 50, pointer.y + 30);
            // Set text content to ingredient description
            this.hoverText.setText("See your crafted potions");
            this.hoverText.setWordWrapWidth(75);
            // Show the text
            this.hoverText.setVisible(true);
        });

        // reward display logic
        if (this.rewards.includes("deerHead")) {
            this.add.image(590, 140, "deerHead").setScale(-.1, .1).setDepth(0);
        }
        if (this.rewards.includes("boot")) {
            this.add.image(80, 500, "boot").setScale(-.05, .05).setDepth(0);
        }
        if (this.rewards.includes("dragonScale")) {
            this.add.image(200, 295, "dragonScale").setScale(.04, .04).setDepth(0).setRotation(.4);
        }
        if (this.rewards.includes("rose")) {
            this.add.image(720, 205, "rose").setScale(.04).setDepth(0).setRotation(.55);
        }
    }
}

