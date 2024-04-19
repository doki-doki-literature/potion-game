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
        for (let i = 1; i < 4; i++){
            this.load.image(`townPerson${i}`, `assets/image/drawings/townspeople${i}.png`)
        }
        SceneUtils.loadUi(this);
    }

    create() {
        SceneUtils.addNavigation(this);

        this.add.image(400, 350, "townPerson1").setScale(0.6, 0.6).setDepth(-1);
    }
}