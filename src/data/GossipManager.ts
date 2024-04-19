import { DataManager } from "./DataManager";
import { Gossip } from "../objects/Gossip";

export class GossipManager extends DataManager {
    gossips: Gossip[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.gossips = [];
    }

    loadGossips() {
        super.loadJSON('gossips', 'src/data/gossip.json');
    }

    processData() {
        const gossipsData = super.getJSON('gossips');

        if (gossipsData) {
          gossipsData.forEach((data) => {
            this.gossips.push(new Gossip(data));
          });
        } else {
          console.error('Failed to load gossip data.');
        }
      }
}