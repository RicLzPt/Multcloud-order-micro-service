import Cpf from "./Cpf";
import Item from "./Item";
import Product from "./Product";
import Coupon from "./Coupon";
import FreightCalculator from "./FreightCalculator";
import OrderCode from "./OrderCode";
import Currencies from "./Currencies";

export default class Order {

    private code: OrderCode;
    private cpf: Cpf;
    private readonly items: Item[];
    private coupon?: Coupon;
    private freight: number = 0;

    constructor(
        cpf: string,
        date: Date = new Date(),
        sequence: number = 1,
        currencies: Currencies = new Currencies()
    ) {
        this.cpf = new Cpf(cpf);
        this.items = [];
        this.code = new OrderCode(date, sequence);
    }

    addItem(product: Product, quantity: number, currencyCode: string = "BRL", currencyValue: number = 1) {
        if (this.items.some(item => item.idProduct === product.idProduct)) {
            throw new Error("Duplicated product");
        }
        this.items.push(new Item(product.idProduct, product.price, quantity, currencyCode, currencyValue));
        this.freight += FreightCalculator.calculate(product);
    }

    addCoupon(coupon: Coupon) {
        if (!coupon.isExpired()) {
            this.coupon = coupon;
        }
    }

    getOrderCode(): string {
        return this.code.getValue();
    }

    getTotal(): number {
        let total: number = 0;
        for (const item of this.items) {
            total += item.getTotal();
        }
        if (this.coupon) {
            total -= this.coupon.getDiscount(total);
        }
        total += this.freight;
        return total;
    }

    getCpf(): string {
        return this.cpf.getValue();
    }


}