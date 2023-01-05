export default class Product {

    constructor(
        readonly idProduct: number,
        readonly description: string,
        readonly price: number,
        readonly width: number,
        readonly height: number,
        readonly length: number,
        readonly weight: number,
        readonly currency: string = "BRL"
    ) {
    }

    getVolume(): number {
        return (this.width / 100) * (this.height / 100) * (this.length / 100);
    }

    getDensity(): number {
        return this.weight / this.getVolume();
    }

}