import ProductDataInterface from "../domain/datainterface/ProductDataInterface";
import FreightCalculator from "../domain/entities/FreightCalculator";
import ZipcodeDataInterface from "../domain/datainterface/ZipcodeDataInterface";
import DistanceCalculator from "../domain/entities/DistanceCalculator";

export default class CalculateFreight {

    constructor(readonly productData: ProductDataInterface, readonly zipcodeData: ZipcodeDataInterface) {
    }

    async execute(input: Input): Promise<Output> {
        let distance = await this.getDistance(input);
        let total = 0;
        for (const item of input.items) {
            const product = await this.productData.getProduct(item.idProduct);
            total += FreightCalculator.calculate(product, distance) * item.quantity;
        }
        return {total};
    }


    private async getDistance(input: Input) {
        let distance;
        if (!input.from || !input.to) return distance;
        const from = await this.zipcodeData.get(input!.from);
        const to = await this.zipcodeData.get(input!.to);
        if (from && to) distance = DistanceCalculator.calculate(from!, to!);
        return distance;
    }
}

type Input = {
    from?: string,
    to?: string,
    items: {
        idProduct: number,
        quantity: number
    }[]
}

type Output = {
    total: number
}