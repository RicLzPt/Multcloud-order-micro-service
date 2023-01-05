export default class Order {
    code: string = "";
    items: any[];
    total: number = 0;

    constructor(readonly cpf: string,) {
        this.items = [];
    }


    addItem(product: any) {
        const existItem = this.items.find((item: any) => item.idProduct === product.idProduct);
        if (!existItem) {
            this.items.push(
                {
                    idProduct: product.idProduct,
                    price: product.price,
                    quantity: 1
                }
            );
        } else {
            existItem.quantity++;
        }
    };

    decreaseItem(item: any) {
        const existItem = this.items.find((itemOrder: any) => itemOrder.idProduct === item.idProduct);
        if (!existItem) return;
        existItem.quantity--;
        if (existItem.quantity === 0) {
            this.items.splice(this.items.indexOf(existItem, 1));
        }

    }

    increaseItem(item: any) {
        const existItem = this.items.find((itemOrder: any) => itemOrder.idProduct === item.idProduct);
        if (!existItem) return;
        existItem.quantity++;

    }

    getTotal() {
        let total = 0;
        for (const item of this.items) {
            total += item.price * item.quantity;
        }
        return total;
    }
}