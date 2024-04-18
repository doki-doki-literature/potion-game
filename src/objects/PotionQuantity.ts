export class PotionQuantity {
    potionId: number;
    quantity: number;

    constructor(data: any) { 
        this.potionId = data.potionId;
        this.quantity = data.quantity;
    }
}