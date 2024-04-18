import * as Phaser from "phaser";
import { SceneUtils } from "../utils/SceneUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Gossip",
};

export class GossipScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image("townPerson1", "assets/image/drawings/townspeople1.png");
        this.load.image("townPerson2", "assets/image/drawings/townspeople2.png");
        this.load.image("townPerson3", "assets/image/drawings/townspeople3.png");
        SceneUtils.loadUi(this);
    }

    create() {
        SceneUtils.addNavigation(this);

        this.add.image(400, 300, "townPerson1").setScale(.08, .08).setDepth(-1);
    }
}