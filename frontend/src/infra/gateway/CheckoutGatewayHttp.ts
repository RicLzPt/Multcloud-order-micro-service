import CheckoutGatewayInterface from "./CheckoutGatewayInterface";
import Product from "../../domain/Product";
import HttpClientInterface from "../http/HttpClientInterface";

export default class CheckoutGatewayHttp implements CheckoutGatewayInterface {

    constructor(readonly httpClient: HttpClientInterface, readonly baseUrl: string) {
    }

    async checkout(input: any): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/checkout`, input);
    }

    async getProducts(): Promise<Product[]> {
        const productsData = await this.httpClient.get(`${this.baseUrl}/products`);
        const products: Product[] = [];
        for (const productData of productsData) {
            products.push(
                new Product(productData.idProduct, productData.description, productData.price)
            );
        }
        return products;
    }

}