import Product from "../entities/Product";

export default interface ProductDataInterface {
    getProduct(idProduct:number): Promise<Product>;
}