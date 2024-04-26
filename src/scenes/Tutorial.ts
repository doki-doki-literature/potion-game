import * as Phaser from "phaser";
import { SoundManager } from "../objects/SoundManager";
import { SceneUtils } from "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Tutorial"
};

export class TutorialScene extends Phaser.Scene {
    soundManager: SoundManager;
    dialogueText: Phaser.GameObjects.Text;
    currentDialogueIndex: number = 0;
    image: Phaser.GameObjects.Image | undefined;
    sprite: Phaser.GameObjects.Sprite;

    dialogues: string[] = [
        "Player: ...",
        "Frog: Please! You're a potion maker, right? Your book fell and I might have taken a peek at it",
        "Narrator: What is this book? The potion archive? You vaguely remember writing this before falling asleep",
        "Narrator: Oh yes, you are a potion maker who makes potions with special powers. You had a dream to be able to discover all the potions and become a potion master, completing your potion archive.",
        "Frog: I have a confession and something to ask of you. I swear I'll follow you for all of eternity if you help me.",
        "Frog: I've always wanted the power to be able to hold an infinite number of things in my mouth. It's been a dream of mine ever since I saw a chipmunk for the first time.",
        "Frog: Have you seen them? they're like this ^",
        "Frog: I've gathered all these ingredients looking for a potion to live out my dream. I've really put a lot of work into it. Finding the best potion ingredients. For the power of infinite mouth storage, you need to make a potion with blue grass and cordyceps.",
        "Frog: Please will you make this potion for me?",
        "Narrator: To make the potion that the frog asked for, you combine the two ingredients into the pot to make a potion.",
        "Narrator: To make the potion that the frog asked for, you combine the two ingredients into the pot to make a potion.",
        "Frog: GULP. I… I think I feel my mouth expanding. My dreams of chipmunk mouth are coming true! Unfortunately, I don't have anymore blue grass and cordyceps, but you can keep the rest of the ingredients. If you give me some beans, I can bring you more ingredients soon. My name is Plug, by the way.",
        "Narrator: The frog bounced away and left you with his extensive collection of ingredients. What a great beginner kit for your potion creating journey! You bring the ingredients to your cabin so you can start your own experiments."
    ]

    imageKeys: (any | null)[] = [
        null,
        null,
        {
            'key': 'book',
            'type': 'image',
            'x': 350,
            'y': 330,
            'scale': 1
        },
        {
            'key': 'book',
            'type': 'image',
            'x': 350,
            'y': 330,
            'scale': 1
        },
        null,
        null,
        {
            'key': 'chipmunk',
            'type': 'anim',
            'x': 400,
            'y': 220,
            'scale': 1
        },
        null,
        null,
        {
            'key': 'tutorial1',
            'type': 'image',
            'x': 400,
            'y': 300,
            'scale': 1
        },
        {
            'key': 'tutorial2',
            'type': 'image',
            'x': 400,
            'y': 300,
            'scale': 1
        },
        null,
        null
    ]

    constructor() {
        super(sceneConfig);
    }
    preload() {
        SceneUtils.loadUi(this);

        this.load.image('soundMuteButton', 'assets/image/ui-assets/volume_muted_button.png')
        this.load.image('soundUnmuteButton', 'assets/image/ui-assets/volume_unmuted_button.png')

        // construct instance of sound manager
        this.soundManager = new SoundManager(this);
        this.soundManager.preload();

        this.load.image('frog', 'assets/image/drawings/frog.png');
        this.load.image('book', 'assets/image/drawings/book.png');
        this.load.image('tutorial1', 'assets/image/tutorial/tutorial_image1.png');
        this.load.image('tutorial2', 'assets/image/tutorial/tutorial_image2.png');

        this.load.spritesheet('chipmunk', 'assets/image/tutorial/chipmunkSprite.png', { frameWidth: 400, frameHeight: 225 });
    }

    create() {
        // const sprite = this.add.sprite(200, 200, 'test');

        // this.anims.create({
        //     key: 'walk',
        //     frames: this.anims.generateFrameNumbers('test', { start: 0, end: 120 }),
        //     frameRate: 10,
        //     repeat: -1 // Repeat indefinitely
        // });
        // sprite.anims.play('walk', true);

        // background music button toggle
        const soundMuteButton = this.add.image(775, 25, 'soundMuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(.5);
        const soundUnmuteButton = this.add.image(775, 25, 'soundUnmuteButton').setScale(1, 1).setInteractive().setDepth(2).setAlpha(.5).setVisible(false);

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

        // displaying frog
        this.add.image(400, 350, 'frog').setScale(2, 2);

        // textbox to display dialogue
        this.add.image(20, 410, 'townTextbox').setDepth(-1).setOrigin(0, 0).setScale(1, 1).setDepth(2);
        this.add.image(408, 495, 'inventoryTile').setDepth(-1).setScale(5.3, .9).setDepth(2);

        // creating an object to display the gossip text
        this.dialogueText = this.add.text(100, 450, '', { color: '#000000' });
        this.dialogueText.setDepth(3); // Ensure the text is above other elements
        this.dialogueText.setWordWrapWidth(620);

        // invisible overlay to read clicks
        const overlay = this.add.rectangle(0, 350, this.cameras.main.width, this.cameras.main.height/2);
        overlay.setOrigin(0);
        overlay.setInteractive();
        overlay.setDepth(4);

        // setting the initial dialogue text
        this.dialogueText.setText("Frog: hello helloo can you hear me?");
        overlay.on("pointerdown", () => {
            if (this.sprite) {
                this.sprite.visible = false;
            }
            if (this.image) {
                this.image.visible = false;
            }
            if (this.currentDialogueIndex < this.dialogues.length) {
                this.dialogueText.setText(this.dialogues[this.currentDialogueIndex]);
                // check if there's an image with the dialogue
                const imageKey = this.imageKeys[this.currentDialogueIndex];
                if (imageKey) {
                    if (imageKey.type === 'anim') {
                        this.sprite = this.add.sprite(imageKey.x, imageKey.y, imageKey.key);

                        this.anims.create({
                            key: 'walk',
                            frames: this.anims.generateFrameNumbers(imageKey.key, { start: 10, end: 120 }),
                            frameRate: 10,
                            repeat: -1 // Repeat indefinitely
                        });
                        this.sprite.anims.play('walk', true);

                    }
                    else if (imageKey.type === 'image') {
                        this.image = this.add.image(imageKey.x, imageKey.y, '');
                        this.image.setTexture(imageKey.key);
                        this.image.setScale(imageKey.scale)
                        this.image.setVisible(true);
                    }
                }
                this.currentDialogueIndex++;
            } else {
                this.scene.start("Cabin");
            }
        });
    }
}