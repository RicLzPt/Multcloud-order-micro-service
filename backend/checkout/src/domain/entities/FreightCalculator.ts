import Product from "./Product";

export default class FreightCalculator {

    static calculate(product: Product, distance: number = 1000): number {
        const itemFreight = distance * product.getVolume() * (product.getDensity() / 100);
        return (itemFreight >= 10) ? Math.round(itemFreight * 100) / 100 : 10;
    }

}