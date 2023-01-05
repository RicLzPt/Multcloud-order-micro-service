export default class Item {

    constructor(
        readonly idProduct: number,
        readonly price: number,
        readonly quantity: number,
        readonly currencyCode: string = "BRL",
        readonly currencyValue: number = 1,
    ) {
        if (this.quantity <= 0) throw new Error("Quantity must be positive");
    }

    getTotal(): number {
        return this.price * this.quantity * this.currencyValue;
    }

}