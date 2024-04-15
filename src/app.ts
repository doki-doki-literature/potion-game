import * as Phaser from "phaser";
import { PotionManager } from "./data/PotionManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 528;

export class GameScene extends Phaser.Scene {
  static readonly TILE_SIZE = 48;
  private potionManager: PotionManager;

  constructor() {
    super(sceneConfig);
  }

  preload() {
    this.potionManager = new PotionManager(this);

    // Load potion and ingredient JSON data
    this.potionManager.loadPotions('src/data/recipes.json');
    this.potionManager.loadIngredients('src/data/ingredients.json');
  }

  create() {
    // Process loaded data
    this.potionManager.processData();

    // Access loaded potions and ingredients
    console.log(this.potionManager.potions);
    console.log(this.potionManager.ingredients);
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: GameScene,
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game",
  backgroundColor: "#48C4F8",
};

export const game = new Phaser.Game(gameConfig);
