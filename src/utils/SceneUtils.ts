import * as Phaser from "phaser";

export class SceneUtils {
    static addNavigation(scene: Phaser.Scene) {
        this.addBackButton(scene);
    }

    private static addBackButton(scene: Phaser.Scene) {
        const backButton = scene.add.image(140, 40, 'navSign').setInteractive().setScale(.9, .9);
        backButton.on("pointerdown", () => {
            return scene.scene.start("Cabin");
        });
    }
}