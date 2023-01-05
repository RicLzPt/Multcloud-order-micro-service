import ProductDataInterface from "../../domain/datainterface/ProductDataInterface";
import Product from "../../domain/entities/Product";
import ConnectionInterface from "../database/ConnectionInterface";
export default class ProductDataDatabase implements ProductDataInterface {

    constructor(readonly connection: ConnectionInterface) {
    }
    async getProduct(idProduct: number): Promise<Product> {
        const [rowData] = await this.connection.query('SELECT * FROM branas9.product WHERE id_product = ?', [idProduct]);
        const productData = rowData[0];
        if(!productData) throw new Error("Product not found");
        return new Product(
            productData.id_product,
            productData.description,
            parseFloat(productData.price),
            productData.width,
            productData.height,
            productData.length,
            productData.weight,
            productData.currency,
        );

    }

}