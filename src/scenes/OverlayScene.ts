import * as Phaser from "phaser";

export class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene' });
    }

    create() {
        // Create a grey transparent rectangle covering the entire screen
        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);
        overlay.setOrigin(0);
        const text1 = this.data.get("text1");
        console.log(text1);
        
        // Add white text on top of the overlay
        const text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "text", { color: '#ffffff' });
        text.setOrigin(0.5);
        this.input.on("pointerdown", () => this.scene.setVisible(false));
    }
}