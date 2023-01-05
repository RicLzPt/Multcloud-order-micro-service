import {validate} from "../domain/entities/CpfValidator";
import ProductDataInterface from "../domain/datainterface/ProductDataInterface";
import CouponDataInterface from "../domain/datainterface/CouponDataInterface";
import MailerConsole from "../infra/mailer/MailerConsole";
import CurrencyGatewayInterface from "../infra/gateway/CurrencyGatewayInterface";
import CurrencyGatewayRandom from "../infra/gateway/CurrencyGatewayRandom";
import MailerInterface from "../infra/mailer/MailerInterface";
import OrderDataInterface from "../domain/datainterface/OrderDataInterface";
import FreightCalculator from "../domain/entities/FreightCalculator";
import Coupon from "../domain/entities/Coupon";
import OrderCode from "../domain/entities/OrderCode";
import Order from "../domain/entities/Order";
import Product from "../domain/entities/Product";
import DistanceCalculator from "../domain/entities/DistanceCalculator";
import ZipcodeDataInterface from "../domain/datainterface/ZipcodeDataInterface";
import CalculateFreight from "./CalculateFreight";

export default class Checkout {

    constructor(
        readonly productData: ProductDataInterface,
        readonly couponData: CouponDataInterface,
        readonly orderData: OrderDataInterface,
        readonly calculateFreight: CalculateFreight,
        readonly currencyGateway: CurrencyGatewayInterface = new CurrencyGatewayRandom(),
        readonly mailer: MailerInterface = new MailerConsole()) {
    }

    async execute(input: Input): Promise<Output> {

        const order = new Order(input.cpf);
        const currencies = await this.currencyGateway.getCurrencies();
        for (const item of input.items) {
            const product = await this.productData.getProduct(item.idProduct);
            order.addItem(product, item.quantity, product.currency, currencies.getCurrency(product.currency));
        }

        const freight = await this.calculateFreight.execute({from: input.from, to: input.to, items: input.items});
        order.freight = freight.total;

        if (input.coupon) {
            const coupon = await this.couponData.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        await this.orderData.save(order);

        const output: Output = {
            code: order.getOrderCode(),
            total: order.getTotal()
        };
        return output;
    };
}

type Input = {
    from?: string,
    to?: string,
    cpf: string,
    email?: string,
    items: {
        idProduct: number,
        quantity: number
    }[],
    coupon?: string
};

type Output = {
    code?: string;
    total: number
};