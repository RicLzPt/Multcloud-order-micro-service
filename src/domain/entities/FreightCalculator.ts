import Product from "./Product";

export default class FreightCalculator {

    static calculate(product: Product): number {
        const itemFreight = 1000 * product.getVolume() * (product.getDensity() / 100);
        return (itemFreight >= 10) ? itemFreight : 10;
    }

}