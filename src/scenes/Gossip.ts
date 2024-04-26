import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";
import { GossipManager } from "../data/GossipManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Gossip"
};

export class GossipScene extends Phaser.Scene {
    private gossipManager: GossipManager;
    private gossipText: Phaser.GameObjects.Text;
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.gossipManager = new GossipManager(this);
        this.gossipManager.loadGossips();
        for (let i = 1; i < 5; i++){
            this.load.image(`townPerson${i}`, `assets/image/drawings/townspeople${i}.png`)
        }
        SceneUtils.loadUi(this);
        this.load.image('crystalBall', 'assets/image/drawings/crystal-ball.png');
    }

    create() {
        SceneUtils.addNavigation(this);

        //background image
        this.add.image(420, 375, 'crystalBall').setScale(3, 3).setDepth(-3);

        //displaying a random townsperson
        this.add.image(400, 350, `townPerson${Math.floor(Math.random()*3)+1}`).setScale(0.6, 0.6).setDepth(-1);

        //textbox to display gossip
        this.add.image(20, 410, 'townTextbox').setDepth(-1).setOrigin(0, 0).setScale(1, 1);
        this.add.image(408, 495, 'inventoryTile').setDepth(-1).setScale(5.3, .9);

        //creating an object to display the gossip text
        this.gossipText = this.add.text(100, 450, '', { color: '#000000' });
        this.gossipText.setDepth(3); // Ensure the text is above other elements
        this.gossipText.setWordWrapWidth(620);

        //setting the gossip text
        this.gossipManager.processData();
        let gossipData = this.gossipManager.gossips;
        let randNum = Math.floor(Math.random()*gossipData.length) + 1;
        let displayedText = this.gossipManager.gossips.find(gossip => gossip.gossipId === randNum)
        if (displayedText) {
            this.gossipText.setText(displayedText.content);
        }

        //generate new gossip button
        this.add.text(260, 380, 'Listen in on another townsperson').setDepth(4);
        const townButton = this.add.image(410,  390, 'button').setInteractive().setScale(1.8, .6).setDepth(3);
        townButton.on("pointerdown", () => {
            return this.scene.start("Gossip");
        });
        SceneUtils.addButtonHover(this, townButton, 410, 390, 3, 1.8, .6)
    }
}