import * as Phaser from "phaser";
import scenes from "./scenes/index";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: [scenes.MainTitleScene, scenes.CabinScene, scenes.CraftScene, scenes.ArchiveScene, scenes.OverlayScene],
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game",
  backgroundColor: "#48C4F8",
};

export const game = new Phaser.Game(gameConfig);
